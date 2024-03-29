"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { MdStar, MdStarHalf, MdStarBorder } from "react-icons/md";

const TOTALSTARS = 5;
const STARWIDTH = 16;

interface RatingProps {
  value: number;
  setValue?: Dispatch<SetStateAction<number>>;
}

const calcStars = (value: number) => {
  const halfStar = value % 1;
  return [
    ...Array(Math.round(value - halfStar)).fill(1),
    ...Array(Math.round(halfStar * 2)).fill(0.5),
    ...Array(Math.round(TOTALSTARS - halfStar * 2 - value)).fill(0),
  ];
};

const getIcon = (star: number) => {
  switch (star) {
    case 1:
      return <MdStar color={"orange"} />;
    case 0.5:
      return <MdStarHalf color={"orange"} />;
    default:
      return <MdStarBorder color={"grey"} />;
  }
};

const calcNewValue = (offsetX: number, starVal: number) => {
  return offsetX > STARWIDTH / 2 ? starVal : starVal - 0.5;
};

export const Rating = ({ value, setValue }: RatingProps) => {
  const [hoverStars, setHoverStars] = useState<null | number>(null);

  const stars = hoverStars ? calcStars(hoverStars) : calcStars(value);

  return (
    <div className="flex p-1">
      {stars.map((star, i) => (
        <div
          key={i + 1}
          className={setValue ? "hover:cursor-pointer" : ""}
          onMouseMove={(e) => setValue && setHoverStars(calcNewValue(e.nativeEvent.offsetX, i + 1))}
          onMouseLeave={() => setHoverStars(null)}
          onClick={(e) => setValue && setValue(calcNewValue(e.nativeEvent.offsetX, i + 1))}
        >
          {getIcon(star)}
        </div>
      ))}
    </div>
  );
};
