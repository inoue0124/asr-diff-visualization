import differ from "../js/htmldiff";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, Typography } from "@material-ui/core";
import ApiClient from "../api";

type TextCardProps = {
  target: string;
  reference: string;
};

const DiffCard: React.FC<TextCardProps> = ({ target, reference }) => {
  const api = new ApiClient();
  const [wer, setWer] = useState<number>(0);
  const diff = differ(target, reference);
  useEffect(() => {
    if (target === "" || reference === "") return;
    api.calculateWer(target, reference).then((res) => {
      res.json().then((data) => {
        setWer(Math.round(data));
      });
    });
  }, [target, reference]);

  return (
    <Card style={{ margin: "20px auto" }}>
      <CardContent>
        <Typography
          variant="h4"
          dangerouslySetInnerHTML={{ __html: diff }}
        ></Typography>
        <div>単語認識率：{100 - wer}%</div>
      </CardContent>
    </Card>
  );
};

export default DiffCard;
