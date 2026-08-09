/** @format */

import Box from "@mui/material/Box";
import Step from "@mui/material/Step";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import { styled } from "@mui/material/styles";

interface FlowStepperProps {
  steps: string[];
  activeStep: number;
}

const FlowConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 18,
    left: "calc(-50% + 18px)",
    right: "calc(50% + 18px)",
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderTopWidth: 2,
    borderColor: theme.palette.grey[300],
    borderRadius: 1,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: theme.palette.primary.main,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: theme.palette.primary.main,
    },
  },
}));

export default function FlowStepper({ steps, activeStep }: FlowStepperProps) {
  return (
    <Box sx={{ width: "100%", maxWidth: 720, mx: "auto", my: 2 }}>
      <Stepper
        activeStep={activeStep}
        alternativeLabel
        connector={<FlowConnector />}
        sx={{
          "& .MuiStepLabel-label": {
            fontSize: "1.2rem",
            fontWeight: 600,
            mt: 1,
            fontFamily: "Parkinsans, sans-serif",
          },
          "& .MuiStepIcon-root": {
            width: 30,
            height: 30,
            color: "var(--border-color)",
            "&.Mui-active": {
              color: "var(--accent-color)",
            },
            "&.Mui-completed": {
              color: "var(--accent-color)",
            },
          },
          "& .MuiStepIcon-text": {
            fill: "var(--bg-body)",
            fontSize: "0.95rem",
            fontWeight: 700,
          },
        }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}
