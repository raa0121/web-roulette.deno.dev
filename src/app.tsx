import useAsset from "ultra/hooks/use-asset.js";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Roulette, useRoulette } from "react-hook-roulette";

// Twind
import { tw } from "./twind/twind.ts";

const rouletteWidth = 500;
const rouletteHeight = 500;
const colors = [
  "royalblue",
  "salmon",
  "palegreen",
  "wheat",
  "plum",
];

type Item = {
  name: string;
  bg: string;
  color: string;
};

const ALLOWD = [
  "-",
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "ArrowDown",
  "Backspace",
];

export default function App() {
  const title = "Webルーレット";
  const description = "Webルーレット";
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
      return;
    }

    setMax(`${newValue}`);
  };

  const keyDownMaxNumber = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key.match(/\d/)) {
      return;
    }
    if (ALLOWD.includes(e.key)) {
      return;
    }

    e.prevntDefault();
  };

  const changeItems = (i: string[]) => {
    const newItems: Item[] = [];
    for (const [key, value] of i.entries()) {
      const bg = getBgColor(key, i.length);
      newItems.push({ name: value, bg: bg, color: "black" });
    }
    setItems(newItems);
  }

  const getBgColor = (index: number, totalCount: number) => {
    const position = index + 1;
    // 要素数が5n+1のとき、5n+1個目の要素は"palegreen"
    if (totalCount % 5 === 1 && position === totalCount) {
      return "palegreen";
    }
    // 要素数が5n+2のとき、5n+1個目の要素は"palegreen"、5n+2個目の要素は"wheat"
    if (totalCount % 5 === 2) {
      if (position === totalCount - 1) {
        return "palegreen";
      } else if (position === totalCount) {
        return "wheat";
      }
    }

    // 上記条件に該当しない場合、通常の配列から背景色を取得
    return colors[index % colors.length];
  }

  const textareaChange = (e) => {
    setTextarea(e.target.value);
    changeItems(e.target.value.split("\n"))
  };

  const createSequential = () => {
    const seq = Array.from({ length: max }, (elm, index) => String(index + 1));
    setTextarea(seq.join("\n"));
    changeItems(seq);
  };

  const onContinueStart = () => {
    onStart();
    onStop();
    if (!items.map((i) => i.name).includes(result)) {
      setContinueResults(continueResults.concat([result]));
    }
    const filteredNames = items.map((i) => i.name).filter((i) => i != result);
    setTextarea(filteredNames.join("\n"));
    changeItems(filteredNames);
  };

  const { roulette, onStart, onStop, result } = useRoulette({
    items,
    options: {
      determineAngle: 0,
      style: {
        arrow: { bg: "red" },
        label: { defaultColor: "black" },
        pie: { border: true, borderWidth: 1 },
      },
    },
  });

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="author" content="raa0121" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Helmet prioritizeSeoTags>
          <meta name="description" content={description} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@raa0121" />
          <meta name="twitter:title" content={title} />
          <meta name="twitter:description" content={description} />
          <meta name="twitter:creator" content="@raa0121" />
          <meta property="og:url" content="https://web-roulette.deno.dev/" />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta
            property="og:image"
            content="https://web-roulette.deno.dev/raa0121.png"
          />
          <title>{title}</title>
        </Helmet>
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
            <textarea id="textarea" value={textarea} onChange={textareaChange}>
            </textarea>
            <div>
              <input
                id="max"
                type="number"
                onChange={changeMaxNumber}
                onKeyDown={keyDownMaxNumber}
              >
              </input>
              <button
                type="button"
                className="btn btn--blue"
                onClick={createSequential}
              >
                連番生成
              </button>
            </div>
            <div>
              <button type="button" className="btn btn--blue" onClick={onStart}>
                開始
              </button>
              <button type="button" className="btn btn--red" onClick={onStop}>
                停止
              </button>
              <button
                type="button"
                className="btn btn--orange"
                onClick={onContinueStart}
              >
                連続抽選
              </button>
              {result ? <p>抽選結果：{result}</p> : <p></p>}
              {continueResults
                ? (
                  <div>
                    <p>連続抽選結果：</p>
                    <>
                      {continueResults.map((r, i) => {
                        return (
                          <div className="continue-result" key={i}>{r}</div>
                        );
                      })}
                    </>
                  </div>
                )
                : <p></p>}
            </div>
          </div>
        </main>
        <footer>
          <p>&copy; 2024 raa0121</p>
          <p>
            Inspired by{" "}
            <a href="https://jp.piliapp.com/random/wheel/" target="_blank">
              Web ルーレット
            </a>
          </p>
        </footer>
      </body>
    </html>
  );
}
