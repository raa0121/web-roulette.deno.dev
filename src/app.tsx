import useAsset from "ultra/hooks/use-asset.js";
import { useState } from "react";
import { Roulette, useRoulette } from 'react-hook-roulette';

// Twind
import { tw } from "./twind/twind.ts";

const rouletteWidth = 500;
const rouletteHeight = 500;
const colors = [
  "palegreen",
  "plum",
  "royalblue",
  "salmon",
  "wheat",
]

type Item = {
  name: string;
  bg: string;
}

const ALLOWD = ["-", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Backspace"];

export default function App() {
  const [width, setWidth] = useState(rouletteWidth);
  const [height, setHeight] = useState(rouletteHeight);
  const [items, setItems] = useState<Item[]>([]);
  const [max, setMax] = useState("");
  const [textarea, setTextarea] = useState("");
  const [continueResults, setContinueResults] = useState<string>([]);

  const changeMaxNumber = (e) => {
    const newValue = parseInt(e.target.value, 10);
    if (isNaN(newValue)) {
      e.prevntDefault();
      return
    }

    setMax(`${newValue}`);
  }

  const keyDownMaxNumber = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key.match(/\d/)) {
      return;
    }
    if (ALLOWD.includes(e.key)) {
      return;
    }

    e.prevntDefault();
  }

  const textareaChange = (e) => {
    setTextarea(e.target.value);
    const newItems: Item[] = []; 
    for (const [key, value] of e.target.value.split("\n").entries()) {
      newItems.push({name: value, bg: colors[key % 7]});
    }
    setItems(newItems);
  }

  const createSequential = () => {
    const seq = Array.from({length: max}, (elm, index) => String(index + 1));
    setTextarea(seq.join("\n"));
    const newItems: Item[] = []; 
    for (const [key, value] of seq.entries()) {
      newItems.push({name: value, bg: colors[key % 7], color: "black"});
    }
    setItems(newItems);
  }

  const onContinueStart = () => {
    onStop();
    setContinueResults(continueResults.concat([result]));
    const filteredNames = items.map((i) => i.name).filter((i) => i != result);
    console.log(filteredNames);
    const newItems: Item[] = [];
    for (const [key, value] of filteredNames.entries()) {
      newItems.push({name: value, bg: colors[key % 7]});
    }
    setTextarea(filteredNames.join("\n"));
    setItems(newItems);
  }

  const { roulette, onStart, onStop, result } = useRoulette({
    items,
    options: {
      determineAngle: 0,
      style: {
        arrow: { bg: "red" },
        label: { defaultColor: "black" },
        pie: { border: true, borderWidth: 1 },
      }
    }
  });

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>Webルーレット</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" href={useAsset("/favicon.ico")} />
        <link rel="stylesheet" href={useAsset("/style.css")} />
      </head>
      <body>
        <main>
          <h2>
            Webルーレット
          </h2>
          <div className="wrapper">
            <Roulette roulette={roulette} />
            <textarea id="textarea" value={textarea} onChange={textareaChange}></textarea>
            <div>
              <input id="max" type="number" onChange={changeMaxNumber} onKeyDown={keyDownMaxNumber}></input>
              <button type="button" className="btn btn--blue" onClick={createSequential}>連番生成</button>
            </div>
            <div>
              <button type="button" className="btn btn--blue" onClick={onStart}>開始</button>
              <button type="button" className="btn btn--red" onClick={onStop}>停止</button>
              <button type="button" className="btn btn--orange" onClick={onContinueStart}>連続抽選</button>
              {result ? <p>抽選結果：{result}</p> : <p></p>}
              {continueResults ? <div>
                <p>連続抽選結果：</p>
                <>
                  {continueResults.map((r, i) => {
                    return <div className="continue-result" key={i}>{r}</div>;
                  })}
                </>
                </div> : <p></p>}
            </div>
          </div>
        </main>
        <footer>
          <p>&copy; 2024 raa0121</p>
          <p>Inspired by <a href="https://jp.piliapp.com/random/wheel/" target="_blank">Web ルーレット</a></p>
        </footer>
      </body>
    </html>
  );
}
