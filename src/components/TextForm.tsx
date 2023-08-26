import React, { useState } from 'react';
import { EmotionModel } from '../model/EmotionModel';
import { TextAnalysisService } from '../services/TextAnalysisService';
import { SentimentModel } from '../model/SentimentModel';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import './styles.css';
// import RenderCustomizedLabel from './RenderCustomizedLabel';

const positiveEmoji = require("../assets/positive.jpeg");
const negativeEmoji = require("../assets/negative.jpeg");
const neutralEmoji = require("../assets/neutral.jpeg");

const COLORS = ['#00C49F','#9c0505', '#0088FE', '#FFBB28', '#FF8042'];

const TextForm: React.FC = () => {
  const [text, setText] = useState<string>("");
  const [emotion, setEmotion] = useState<EmotionModel>({
    Angry: 0,
    Fear: 0,
    Happy: 0,
    Sad: 0,
    Surprise: 0
  });
  const [sentiment, setSentiment] = useState<SentimentModel>({
    confidence: 0,
    content_type: "",
    language: "",
    score: 0,
    sentiment: ""
  });
  const [sentimentText, setSentimentText] = useState<string>("");
  const [sentimentEmoji, setSentimentEmoji] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);


  const handleCheckEmotion = async () => {
    try {
      setIsLoading(true);
      const raw = text;

      const emotionResponse = await TextAnalysisService.showEmotions(raw);
      const emotionResult: EmotionModel = emotionResponse.data;
      console.log("emotion", emotionResult);
      setEmotion(emotionResult);

      const sentimentResponse = await TextAnalysisService.showSentiment(raw);
      const sentimenResult: SentimentModel = sentimentResponse.data;
      console.log("sentiment", sentimenResult);
      setSentiment(sentimenResult);

      if (sentimenResult.score > 2) {
        setSentimentEmoji(positiveEmoji);
        setSentimentText("Positive");
      } else if (sentimenResult.score < 2) {
        setSentimentEmoji(negativeEmoji);
        setSentimentText("Negative")
      } else {
        setSentimentEmoji(neutralEmoji);
        setSentimentText("Neutral")
      }

    } catch (err: any) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }

  const filteredEmotionData = Object.entries(emotion)
    .filter(([emotionName, value]) => value > 0)
    .map(([emotionName, value]) => ({ name: emotionName, value }));

  return (
    <>
      <div className="container">
        <h1>Text Analysis</h1>
        <textarea
          className="textarea"
          value={text}
          placeholder="Enter text here..."
          onChange={(e) => setText(e.target.value)}
        />
        <button
          className="button"
          onClick={handleCheckEmotion}
        >
          Check Emotion
        </button>
      </div>
      {isLoading ? (
        <Backdrop
          open={true}
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : null}
      <div className="body-container">
        {emotion && (
          <div className='table-container'>
            <h2>Emotion</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  dataKey="value"
                  data={filteredEmotionData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {filteredEmotionData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            {/* <table>
              <thead>
                <tr>
                  <th>Emotion</th>
                  <th>Rate</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(emotion).map((emotionName) => (
                  <tr key={emotionName}>
                    <td>{emotionName}</td>
                    <td>{emotion[emotionName]}</td>
                  </tr>
                ))}
              </tbody>
            </table> */}
          </div>
        )}
        {sentiment && (
          <div className="sentiment-container">
            <h2>Sentiment</h2>
            {(sentimentEmoji) ? (
              <div>
                <img src={sentimentEmoji} alt="" />
                <p>{sentimentText}</p>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </>
  );
}

export default TextForm;