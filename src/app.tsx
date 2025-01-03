import useAsset from "ultra/hooks/use-asset.js";
import useEnv from "ultra/hooks/use-env.js";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Roulette, useRoulette } from "react-hook-roulette";

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
  '-',
  'ArrowLeft',
  'ArrowRight',
  'ArrowUp',
  'ArrowDown',
  'Backspace',
];

export default function App() {
  const title = 'Webルーレット';
  const description = 'Webルーレット';
  const [items, setItems] = useState<Item[]>([]);
  const [max, setMax] = useState('');
  const [textarea, setTextarea] = useState('');
  const [continueResults, setContinueResults] = useState<string[]>([]);
  const [fontSize, setFontSize] = useState(48);
  const [isContinue, setIsContinue] = useState(false);
  const ultraMode = useEnv('ULTRA_MODE');
  const opgImageUrl = ultraMode === 'production' ? 'https://web-roulette.deno.dev' : 'http://localhost:8080';

  const changeMaxNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    if (isNaN(newValue)) {
      e.preventDefault();
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

    e.preventDefault();
  };

  const changeItems = (i: string[]) => {
    const newItems: Item[] = [];
    for (const [key, value] of i.entries()) {
      const bg = getBgColor(key, i.length);
      newItems.push({ name: value, bg: bg, color: 'black' });
    }
    setItems(newItems);
    if (i.length > 36) {
      setFontSize(18);
    } else if (i.length > 27) {
      setFontSize(24);
    } else if (i.length > 18) {
      setFontSize(32);
    } else {
      setFontSize(48);
    }
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

  const textareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextarea(e.target.value);
    changeItems(e.target.value.split("\n"))
    e.preventDefault();
  };

  const createSequential = () => {
    const seq = Array.from({ length: Number(max) }, (_elm, index) => String(index + 1));
    setTextarea(seq.join("\n"));
    changeItems(seq);
  };

  const onContinueStart = () => {
    onStart();
    setIsContinue(true);
  };

  const onSpinUp = () => {
    setTimeout(function() {
      onStop();
    }, 2000);
  }

  const onSpinEnd = (result: string) => {
    if (isContinue) {
      setContinueResults(continueResults.concat([result]));
      const filteredNames = items.map((i) => i.name).filter((i) => i != result);
      setTextarea(filteredNames.join("\n"));
      changeItems(filteredNames);
    }
  }

  const { roulette, onStart, onStop, result } = useRoulette({
    items,
    onSpinUp: onSpinUp,
    onSpinEnd: onSpinEnd,
    options: {
      size: 600,
      determineAngle: 0,
      style: {
        arrow: { bg: "red" },
        label: { defaultColor: "black", font: `${fontSize}px "游ゴシック","Yu Gothic"` },
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
          <meta property="og:image" content={opgImageUrl + useAsset('/raa0121.png')} />
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
            <div className="continue-number">
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
              {result ? <p className="result">抽選結果：{result}</p> : <p></p>}
              {continueResults.length !== 0
                ? (
                  <div>
                    <div className="result">連続抽選結果：</div>
                    <div className="continue-results">
                      {continueResults.map((r, i) => {
                        return (
                          <div className="result" key={i}>{r}</div>
                        );
                      })}
                    </div>
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
