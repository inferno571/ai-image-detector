from playwright.sync_api import sync_playwright, Page, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    try:
        page.set_viewport_size({"width": 1920, "height": 1080})
        page.goto("http://localhost:5173/")

        # Look for the unique test class
        main_card = page.locator(".jules-was-here-test-class")
        expect(main_card).to_be_visible(timeout=5000)

        # If it passes, take the screenshot
        page.wait_for_timeout(1000)
        page.screenshot(path="jules-scratch/verification/ui_redesign.png", full_page=True)

    finally:
        context.close()
        browser.close()

with sync_playwright() as playwright:
    run(playwright)
