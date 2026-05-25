const express = require("express");
const puppeteer = require("puppeteer");

const app = express();

app.get("/", async (req, res) => {

    const url = req.query.url;

    if (!url) {
        return res.send("Thiếu URL ");
    }

    const browser = await puppeteer.launch({
        headless: true,
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox"
        ]
    });

    const page = await browser.newPage();

    // mở full HD
    await page.setViewport({
        width: 1920,
        height: 1080
    });

    //  mở Scribd
    await page.goto(url, {
        waitUntil: "networkidle2",
        timeout: 0
    });

    //  đợi render
    await page.waitForTimeout(3000);

    //  sửa HTML
    await page.evaluate(() => {

        // toolbar
        document
        .querySelectorAll(".toolbar_top")
        .forEach(el => {
            el.style.display = "none";
        });

        document
        .querySelectorAll(".toolbar_bottom")
        .forEach(el => {
            el.style.display = "none";
        });

        // cookie
        document
        .querySelectorAll(".qc-cmp2-container")
        .forEach(el => {
            el.style.display = "none";
        });

        // fullscreen
        document.body.style.margin = "0";
        document.body.style.background = "white";

    });

    // lấy HTML sau chỉnh sửa
    const html = await page.content();

    await browser.close();

    res.send(html);

});

app.listen(3000, () => {

    console.log("🔥 SERVER ĐANG CHẠY:");
    console.log("http://localhost:3000");

});