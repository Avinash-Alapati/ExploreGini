import asyncio
import logging
from urllib.parse import urljoin, urlparse
from app.config import settings

logger = logging.getLogger(__name__)

def _is_valid_url(text: str) -> bool:
    try:
        parsed = urlparse(text.strip())
        return parsed.scheme in ("http", "https") and bool(parsed.netloc)
    except Exception:
        return False

async def _fetch_markdown_crawl4ai(url: str) -> str | None:
    try:
        from crawl4ai import AsyncWebCrawler, BrowserConfig, CrawlerRunConfig, CacheMode
        browser_cfg = BrowserConfig(headless=True, verbose=False)
        run_cfg = CrawlerRunConfig(
            cache_mode=CacheMode.BYPASS, 
            page_timeout=settings.CRAWL_TIMEOUT_SECONDS * 1000
        )
        async with AsyncWebCrawler(config=browser_cfg) as crawler:
            result = await crawler.arun(url=url, config=run_cfg)
            if result.success:
                return result.markdown
            logger.warning(f"Crawl4AI crawl failed for {url}: {getattr(result, 'error_message', 'unknown error')}")
            return None
    except Exception as e:
        logger.warning(f"Crawl4AI not available or failed: {e}. Trying fallback HTTP parser...")
        return None

async def _fetch_markdown_fallback(url: str) -> str | None:
    try:
        import httpx
        from bs4 import BeautifulSoup

        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
        async with httpx.AsyncClient(timeout=settings.CRAWL_TIMEOUT_SECONDS, follow_redirects=True) as client:
            resp = await client.get(url, headers=headers)
            if resp.status_code >= 400:
                return None
            
            soup = BeautifulSoup(resp.text, "html.parser")
            for tag in soup(["script", "style", "nav", "footer", "noscript", "svg"]):
                tag.decompose()
                
            text = soup.get_text(separator=" ", strip=True)
            return " ".join(text.split())
    except Exception as e:
        logger.error(f"Fallback crawler failed for {url}: {e}")
        return None

async def fetch_page_summary_async(url: str, max_chars: int = 2000) -> str | None:
    if not _is_valid_url(url):
        logger.warning(f"'{url}' is not a valid http(s) URL, skipping crawl.")
        return None
        
    # Attempt Crawl4AI first
    markdown = await _fetch_markdown_crawl4ai(url)
    if not markdown:
        markdown = await _fetch_markdown_fallback(url)
        
    return markdown[:max_chars].strip() if markdown else None

def fetch_page_summary(url: str, max_chars: int = 2000) -> str | None:
    if not _is_valid_url(url):
        logger.warning(f"'{url}' is not a valid http(s) URL, skipping crawl.")
        return None
    try:
        try:
            loop = asyncio.get_running_loop()
        except RuntimeError:
            loop = None

        if loop and loop.is_running():
            # In an active event loop, run as task or thread
            import concurrent.futures
            with concurrent.futures.ThreadPoolExecutor() as executor:
                return executor.submit(lambda: asyncio.run(fetch_page_summary_async(url, max_chars))).result()
        else:
            return asyncio.run(fetch_page_summary_async(url, max_chars))
    except Exception as e:
        logger.error(f"Crawl error for {url}: {e}")
        return None

async def discover_team_page(base_url: str) -> str | None:
    if not _is_valid_url(base_url):
        return None
    try:
        from crawl4ai import AsyncWebCrawler, BrowserConfig, CrawlerRunConfig, CacheMode
        browser_cfg = BrowserConfig(headless=True, verbose=False)
        run_cfg = CrawlerRunConfig(
            cache_mode=CacheMode.BYPASS, 
            page_timeout=settings.CRAWL_TIMEOUT_SECONDS * 1000
        )
        async with AsyncWebCrawler(config=browser_cfg) as crawler:
            result = await crawler.arun(url=base_url, config=run_cfg)
            if not result.success:
                return None
            links = result.links.get("internal", []) if hasattr(result, "links") else []
            for link in links:
                href = link.get("href", "") if isinstance(link, dict) else str(link)
                text = link.get("text", "") if isinstance(link, dict) else ""
                haystack = f"{href} {text}".lower()
                if any(hint in haystack for hint in settings.TEAM_PAGE_HINTS):
                    return urljoin(base_url, href)
    except Exception as e:
        logger.warning(f"Team page discovery failed for {base_url}: {e}")
    return None
