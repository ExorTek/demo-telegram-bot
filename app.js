const TelegramBotApi = require('node-telegram-bot-api');

const token = 'TELEGRAM_BOT_TOKEN';

const bot = new TelegramBotApi(token, { polling: true });

bot.on('polling_error', (error) => {
  console.error(`Polling error: ${error}`);
});

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const message = `Hello ${msg.from.first_name || msg.from.username || 'there'}! Welcome to App. To help us find the right jobs for you, could you please send us your CV?`;
  bot.sendMessage(chatId, message);
});

bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  const isMessageIncludeFile = msg.document || msg.photo;

  if (isMessageIncludeFile) {
    const fileId = msg.document ? msg.document.file_id : msg.photo[msg.photo.length - 1].file_id;

    console.log('File ID:', fileId);

    bot.getFileLink(fileId).then((fileLink) => {
      console.log(`File URL: ${fileLink}`);
    });

    bot
      .sendMessage(chatId, '📥 *Thank you for your portfolio!* We have received your CV.', { parse_mode: 'Markdown' })
      .then(() => {
        setTimeout(() => {
          bot.sendMessage(chatId, '🔍 *Looking for new jobs…*', { parse_mode: 'Markdown' });
        }, 1000);

        setTimeout(() => {
          const img = 'https://via.placeholder.com/800';
          const message = `
🔔 *New Job Alert!* 🔔
🎨 *NFT Artist Needed by Fabam.sol* 🎨

📄 *Job Description* 📄

We are seeking a talented NFT artist to create a collection of 10,000 unique NFTs for our project.
`;

          const options = {
            reply_markup: {
              inline_keyboard: [
                [{ text: '✅ Apply', callback_data: 'apply' }],
                [
                  {
                    text: '👁️ View Details',
                    callback_data: 'details',
                  },
                ],
              ],
            },
            parse_mode: 'Markdown',
          };

          bot.sendPhoto(chatId, img, { caption: message, ...options });
        }, 3000);
      });
  }
});

bot.on('callback_query', (callbackQuery) => {
  const msg = callbackQuery.message;
  const data = callbackQuery.data;
  const chatId = msg.chat.id;
  if (data === 'apply') {
    const message = `✅ *Application successful*! You have applied for the job. We will notify you if you are selected.`;
    bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
  } else if (data === 'details') {
    const message = `
📝 *Job Details* 📝

- *Job Type:* One Time
- *Budget:* $1,250 USDC - $1,500 USDC
- *Doxxing Needed:* No
- *Location:* Remote
- *Skills:* NFT Art, Digital Art, Illustration
- *Duration:* 1 month
    `;
    bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
  }
});

console.log('Bot is running');
