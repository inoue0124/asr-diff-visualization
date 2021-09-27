import differ from "../js/htmldiff";
import { useState, useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import ApiClient from "../api";

const Index = () => {
  const api = new ApiClient();
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  if (!browserSupportsSpeechRecognition) {
    return (
      <span>
        このブラウザはサポートされていません。Chromeを使用してください。
      </span>
    );
  }
  const onClickRecordBtn = () =>
    SpeechRecognition.startListening({ language: "en-US" });
  const onClickStopBtn = () => SpeechRecognition.stopListening();

  const [target, setTarget] = useState<string>("");
  const [reference, setReference] = useState<string>(
    "Go Serverless v1.0! Your function executed successfully!"
  );
  const [diff, setDiff] = useState<string>("");
  const [wer, setWer] = useState<number>(0);

  useEffect(() => {
    setDiff(differ(target.toLowerCase(), reference.toLowerCase()));
  }, [target, reference]);

  useEffect(() => {
    setTarget(transcript);
  }, [transcript]);

  useEffect(() => {
    if (listening === false) {
      api.calculateWer(reference, target).then((res) => {
        res.json().then((data) => {
          setWer(data);
        });
      });
    }
  }, [listening]);

  return (
    <>
      <div>{target}</div>
      <div>{reference}</div>
      <div dangerouslySetInnerHTML={{ __html: diff }}></div>
      <div>単語認識率：{100 - wer}</div>
      <button onClick={onClickRecordBtn}>録音</button>
      <button onClick={onClickStopBtn}>停止</button>
    </>
  );
};

export default Index;
