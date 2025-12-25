"use client";

import React from "react";
import styles from "./Evalbar.module.css";

export enum EvalBarOrientation {
  auto = "auto",
  vertical = "vertical",
  horizontal = "horizontal"
}

interface Props {
  evaluation?: number | string | null;
  orientation?: EvalBarOrientation
}

/**
 * EvalBar to display evaluation of the current position with evaluation value
 * 
 * Configured to orient the bar horizontally or vertically or automatically base on the device orientation
 * @param evaluation Evaluation of the position (`number`|`string`)
 * @param orientation Orientation of the bar | default: `auto`
 * @returns `EvalBar` component
 */
const EvalBar = ({ evaluation, orientation }: Props) => {
  let black = 0.5, white = 0.5, e = evaluation || 0;
  try {
    e = e.toString().trim();
    if (/^[-+]?(M?\d+|\d+\.\d+)?$/.test(e)) {
      let value = 0.0
      const negative = e.startsWith("-");
      const mate = e.replace(/-|\+/, "").startsWith("M");
      value = parseFloat(e.replace("M", ""));
      white = mate ? (negative ? 0 : 1) : Math.min(Math.max((12 + value) / 24, 0), 1);
      value = Math.abs(value)
      if (mate && value == 0) throw Error(`Invalid evaluation: '${evaluation}'`);
      black = 1 - white;
      e = `${value == 0 ? "" : negative ? "-" : "+"}${mate ? "M" : ""}${mate ? value.toFixed(0) : parseFloat(value.toFixed(value > 99 ? 0 : value > 10 ? 1 : 2))}`;
    }
    else if (/^1-0|0-1|1\/2-1\/2$/.test(e)) {
      if (e == "1-0") white = 1
      else if (e == "0-1") white = 0
      else {
        white = 0.5
        e = "Draw"
      }
      black = 1 - white
    }
    else throw Error(`Invalid evaluation: '${evaluation}'`);
  } catch (error) {
    console.error(error);
  }

  const blackClassName = `${styles.evalbarFill} bg-gray-900`
  const whiteClassName = `${styles.evalbarFill} bg-gray-200`
  const textClassName = `${styles.evalbarValue} absolute w-full h-full font-semibold text-xs p-0.5 ${black > white ? "justify-start text-gray-200" : "justify-end text-gray-900"}`

  return (
    <>
      <div data-orientation={orientation ?? EvalBarOrientation.auto} className={`${styles.evalbar} rounded-sm`}>
        <div className={textClassName}>{e}</div>
        <div style={{ flexGrow: black }} className={blackClassName} />
        <div style={{ flexGrow: white }} className={whiteClassName} />
      </div>
    </>
  );
};

export default EvalBar;
