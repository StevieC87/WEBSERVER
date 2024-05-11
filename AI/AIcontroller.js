const { Configuration, OpenAIApi } = require("openai");
//const fs = require('fs');
require("dotenv").config();

exports.CHATGPTpromptAPI = async function (req, res, next) {
  try {
    console.log("API Key:", process.env.OPENAI_API_KEY);
    console.log("hello");
    console.log(req.body);

    const userInput = req.body.userInput;

    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    // Read the data from the text file
    // const data = fs.readFileSync('INPUTtext.txt', 'utf8');

    const data = userInput;

    const completion = await openai.createChatCompletion({
      model: "gpt-4-0125-preview", // gpt-4
      messages: [
        {
          role: "user",
          content: data,
        },
      ],
    });

    const completion_text = completion.data.choices[0].message.content;
    //make it json
    let json = JSON.stringify(completion_text);

    const result = `Received: ${userInput}`;
    res.json({ result: json });
    //DUMMY json response
    //res.json({ "prompt": "This is a prompt", "response": "This is a response" })

    // Write the result to a new .txt file
    // fs.writeFileSync('result.txt', completion_text);
  } catch (error) {
    if (error.response) {
      console.log(error.response.status);
      console.log(error.response.data);
    } else {
      console.log(error.message);
    }
  }
};

exports.CHATGPTpromptAPIwHistory = async function (req, res, next) {
  try {
    console.log(req.body);
    //let history = [];
    // Initialize history in session if it doesn't exist
    console.log("Session history0", req.session.history);

    if (!req.session.history) {
      req.session.history = [];
    }
    console.log("Session history1", req.session.history);

    const userInput = req.body.userInput;

    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    const data = userInput;

    const completion = await openai.createChatCompletion({
      model: "gpt-4-1106-preview", // gpt-4
      messages: [
        {
          role: "user",
          // content: `history: ${history} AND current prompt: ${data}`,
          content: `history: ${JSON.stringify(
            req.session.history
          )} AND current prompt: ${data}`,
        },
      ],
    });

    const completion_text = completion.data.choices[0].message.content;

    // Append interaction to history
    //  history.push({ userInput: data, aiResponse: completion_text });
    req.session.history.push({ userInput: data, aiResponse: completion_text });

    // Optionally, if you want to send the history back
    // let json = JSON.stringify({ userInput: data, aiResponse: completion_text, history: history });

    // If you want to only send the current interaction
    let json = JSON.stringify(completion_text);

    const result = `Received: ${userInput}`;
    //console.log("history", history);
    console.log("Session history2", req.session.history);

    res.json({ result: json });

    // If using persistent storage, save the history array to a database or file here
  } catch (error) {
    if (error.response) {
      console.log(error.response.status);
      console.log(error.response.data);
    } else {
      console.log(error.message);
    }
  }
};
