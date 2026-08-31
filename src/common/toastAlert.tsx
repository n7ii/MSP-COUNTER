import * as React from "react";

import  { Toaster } from "react-hot-toast";


interface ToastAlertProps {
  position?:
      | "top-left"
      | "top-center"
      | "top-right"
      | "bottom-left"
      | "bottom-center"
      | "bottom-right";
  icon?: React.ReactNode;
  duration?: number;
  style?: React.CSSProperties;
}

const ToastAlert: React.FC<ToastAlertProps> = ({
                                                 position = "top-center",
                                               }) => {


  return <Toaster  position={position} />;
};

export default ToastAlert;
