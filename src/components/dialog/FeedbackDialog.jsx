import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { sendQuestion } from "../../http";

export default function FormDialog(props) {
  const { open, handleCancel, handleSubmit, trans } = props;
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [question, setQuestion] = useState("");
  const [isQuestionValid, setIsQuestionValid] = useState(true);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleQuestionChange = (event) => {
    setQuestion(event.target.value);
  };

  useEffect(() => {
    setIsEmailValid(
      email === ""
        ? true
        : !!email.match(
            /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
          )
    );
    setIsQuestionValid(question === "" ? true : !!question?.length);
  }, [email, question]);

  const handleClean = () => {
    setEmail("");
    setQuestion("");
  };

  const handleCancelClick = () => {
    handleClean();
    handleCancel();
  };

  const handleSubmitClick = () => {
    sendQuestion({ email, quest: question });
    handleSubmit({ email, question });
  };

  return (
    <div>
      <Dialog open={open} onClose={handleCancelClick}>
        <DialogTitle>{trans("v3trans.docs.feedbackDialogTitle")}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {trans("v3trans.docs.feedbackDialogContent")}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="email"
            label={trans("v3trans.docs.emailAddress")}
            type="email"
            fullWidth
            variant="standard"
            error={!isEmailValid}
            helperText={!isEmailValid && trans("v3trans.docs.emailInvaild")}
            onChange={handleEmailChange}
          />
          <TextField
            margin="dense"
            id="question"
            label={trans("v3trans.docs.yourQuestion")}
            multiline
            rows={4}
            fullWidth
            variant="standard"
            error={!isQuestionValid}
            helperText={
              !isQuestionValid && trans("v3trans.docs.yourQuestionInvalid")
            }
            onChange={handleQuestionChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelClick}>
            {trans("v3trans.docs.cancel")}
          </Button>
          <Button
            onClick={handleSubmitClick}
            disabled={
              email === "" || question === ""
                ? true
                : !isEmailValid && !isQuestionValid
            }
          >
            {trans("v3trans.docs.submit")}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
