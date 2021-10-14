import { useState, useEffect } from "react";
import InputCard from "../component/InputCard";
import DiffCard from "../component/DiffCard";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  OutlinedInput,
} from "@material-ui/core";
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
    SpeechRecognition.startListening({ language: lang });
  const onClickStopBtn = () => SpeechRecognition.stopListening();
  const [target, setTarget] = useState<string>("");
  const [reference, setReference] = useState<string>("");
  const [lang, setLang] = useState<string>("");
  useEffect(() => {
    setTarget(transcript);
  }, [transcript]);

  return (
    <div style={{ maxWidth: 900, margin: "auto", paddingTop: 20 }}>
      <InputCard
        title="正解テキスト"
        placeholder="正解テキストを入力してください。"
        onChangeText={(text) => {
          setReference(text);
        }}
        text={reference}
      >
        {reference}
      </InputCard>
      <div style={{ marginTop: "20px" }}>
        <Button
          variant="contained"
          color={listening ? "secondary" : "primary"}
          startIcon={listening ? <StopIcon /> : <MicIcon />}
          onClick={listening ? onClickStopBtn : onClickRecordBtn}
        >
          {listening ? "録音停止" : "録音開始"}
        </Button>
        <FormControl
          variant="outlined"
          size="small"
          style={{ marginLeft: "10px", width: 100 }}
        >
          <InputLabel id="select-outlined-label">言語</InputLabel>
          <Select
            labelId="select-outlined-label"
            id="select-outlined"
            value={lang}
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
              setLang(event.target.value);
            }}
            label="言語"
            input={<OutlinedInput margin="dense" />}
          >
            <MenuItem value="en-US">英語</MenuItem>
            <MenuItem value="ja-JP">日本語</MenuItem>
            <MenuItem value="zh-CN">中国語</MenuItem>
          </Select>
        </FormControl>
      </div>
      <InputCard
        title="認識結果"
        placeholder="認識結果のテキストを入力するか、録音開始ボタンを押して音声認識を開始してください。"
        onChangeText={(text) => {
          setTarget(text);
        }}
        text={target}
      >
        {target}
      </InputCard>
      {target !== "" && reference !== "" && (
        <DiffCard target={target} reference={reference} lang={lang}></DiffCard>
      )}
    </div>
  );
};

export default Index;
