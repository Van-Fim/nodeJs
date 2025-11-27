const http = require('http');
const axios = require('axios');

const WEBHOOK_URL = "https://b24-t75tb3.bitrix24.by/rest/1/kgdvfehbatl3o6j2";

async function getCompanies() {
  let allCompanies = [];
  let start = 0;

  while (true) {
    const response = await axios.get(`${WEBHOOK_URL}/crm.company.list`, {
      params: { start, select: ["ID", "TITLE"] }
    });
    const result = response.data.result;
    if (!result || result.length === 0) break;

    allCompanies = allCompanies.concat(result);
    if (result.length < 50 || allCompanies.length >= 10000) break;
    start += 50;
  }
  return allCompanies;
}

http.createServer(async (req, res) => {
  const companies = await getCompanies();
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });

    res.write("<h1>Список компаний</h1><ul>");
    companies.forEach(c => {
      res.write(`<li>${c.ID}: ${c.TITLE}</li>`);
    });
    res.write("</ul>");
    res.end();
}).listen(3000, () => {
  console.log("Сервер запущен: http://localhost:3000");
});
