import { Card, CardContent, CardHeader, TextField } from "@material-ui/core";

type TextCardProps = {
  title: string;
  placeholder: string;
  onChangeText: (text: string) => void;
  text: string;
};

const InputCard: React.FC<TextCardProps> = ({
  title,
  placeholder,
  onChangeText,
  text,
}) => {
  return (
    <Card>
      <CardHeader title={title}></CardHeader>
      <CardContent>
        <TextField
          placeholder={placeholder}
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
