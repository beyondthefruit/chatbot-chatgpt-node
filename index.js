import openai from './config/open-ai.js';
import readlineSync from 'readline-sync';
// readlineSynd is use to manage a conversation with the user via a console

import colors from 'colors';
// only use to display colors in the console

async function main() {
  console.log(colors.bold.green('Welcome to the Chatbot Program!'));
  console.log(colors.bold.green('You can start chatting with the bot.'));

  // store conversation history, without every question are non related
  const chatHistory = [];

  // we use while to keep going with the conversation / without that chat will end after each question/response
  while (true) {
    const userInput = readlineSync.question(colors.yellow('You: '));
    try {
      // chat history, we iterate through the chat History
      const messages = chatHistory.map(([role, content]) => ({
        role,
        content,
      }));

      // add latest user input using push method
      messages.push({ role: 'user', content: userInput });

      // call the API with user input
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: messages,
      });

      // To get completion text/content / it is an object .[]
      const completionText = completion.choices[0].message.content;

      // if user type exit we end the chat
      if (userInput.toLocaleLowerCase() === 'exit') {
        console.log(colors.green('Bot: ') + completionText);
        return;
      }
      // this is the response from gpt
      console.log(colors.green('Bot: ') + completionText);

      // update history with user input & assistant rsp

      chatHistory.push(['user', userInput]);
      chatHistory.push(['assistant', completionText]);
    } catch (error) {
      console.error(colors.red(error));
    }
  }
  // const chatCompletion = await openai.chat.completions.create({
  //   model: 'gpt-3.5-turbo',
  //   // messages: [{ role: 'user', content: 'Hello!' }],
  //   messages: [
  //     { role: 'user', content: 'What the name of the actual French president' },
  //   ],
  // });
  // console.log(chatCompletion.choices[0].message.content);
}

main();
