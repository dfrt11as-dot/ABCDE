// Используем стандартный импорт (Cloudflare соберет его сам)
import { ethers } from 'ethers';

export default {
  async fetch(request, env) {
    // 1. Проверка метода
    if (request.method !== "POST") {
      return new Response("Бот запущен и ожидает сигналов от TradingView.", { status: 200 });
    }

    try {
      // 2. Читаем входящий JSON
      const data = await request.json();
      console.log("Получен сигнал:", JSON.stringify(data));

      // 3. Проверка безопасности (Secret Key)
      if (!data.secret || data.secret !== env.BOT_SECRET) {
        console.error("Ошибка: Неверный или отсутствующий секрет.");
        return new Response("Unauthorized", { status: 401 });
      }

      // 4. Инициализация блокчейн-соединения
      const provider = new ethers.JsonRpcProvider(env.ALCHEMY_URL);
      const wallet = new ethers.Wallet(env.PRIVATE_KEY, provider);

      // 5. Логика обработки сигналов
      const action = data.action ? data.action.toLowerCase() : ""; 
      const ticker = data.ticker || "ETHUSDC";
      const amount = data.amount_usd || "0";

      if (action === "buy") {
        console.log(`>>> Исполняю покупку ${ticker} на ${amount}$`);
        return new Response(JSON.stringify({ status: "Success", message: "Buy order simulated" }), {
          headers: { "Content-Type": "application/json" }
        });
      } 
      
      if (action === "sell") {
        console.log(`>>> Исполняю продажу ${ticker}`);
        return new Response(JSON.stringify({ status: "Success", message: "Sell order simulated" }), {
          headers: { "Content-Type": "application/json" }
        });
      }

      return new Response("Сигнал получен, но действие не распознано.", { status: 400 });

    } catch (error) {
      console.error("Критическая ошибка:", error.message);
      return new Response("Internal Error: " + error.message, { status: 500 });
    }
  }
};
