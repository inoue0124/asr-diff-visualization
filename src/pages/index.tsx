import { useState, useEffect } from "react";
import TextCard from "../component/InputCard";
import DiffCard from "../component/DiffCard";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { Button } from "@material-ui/core";
import MicIcon from "@material-ui/icons/Mic";
import StopIcon from "@material-ui/icons/Stop";

const Index = () => {
  const { transcript, listening, browserSupportsSpeechRecognition } =
    useSpeechRecognition();
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
  const [reference, setReference] = useState<string>("");
  useEffect(() => {
    setTarget(transcript);
  }, [transcript]);

  return (
    <div style={{ maxWidth: 900, margin: "auto" }}>
      <TextCard
        title="正解テキスト"
        onChangeText={(text) => {
          setReference(text);
        }}
        text={reference}
      >
        {reference}
      </TextCard>
      <Button
        variant="contained"
        color={listening ? "secondary" : "primary"}
        startIcon={listening ? <StopIcon /> : <MicIcon />}
        onClick={listening ? onClickStopBtn : onClickRecordBtn}
      >
        {listening ? "録音停止" : "録音開始"}
      </Button>
      <TextCard
        title="認識結果"
        onChangeText={(text) => {
          setTarget(text);
        }}
        text={target}
      >
        {target}
      </TextCard>
      {target !== "" && reference !== "" && (
        <DiffCard target={target} reference={reference}></DiffCard>
      )}
    </div>
  );
};

export default Index;
