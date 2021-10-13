import { Card, CardContent, CardHeader, TextField } from "@material-ui/core";

type TextCardProps = {
  title: string;
  onChangeText: (text: string) => void;
  text: string;
};

const InputCard: React.FC<TextCardProps> = ({ title, onChangeText, text }) => {
  return (
    <Card style={{ margin: "20px auto" }}>
      <CardHeader title={title}></CardHeader>
      <CardContent>
        <TextField
          placeholder={`${title}を入力してください`}
          multiline
          fullWidth
          variant="outlined"
          onChange={(event) => {
            onChangeText(event.target.value);
          }}
          value={text}
        />
      </CardContent>
    </Card>
  );
};

export default InputCard;
