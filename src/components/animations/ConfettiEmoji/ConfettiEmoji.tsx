import { CSSProperties } from "react";
import { Confetti } from "../../magicui/confetti";
import ButtonX from "../../buttonCustom/ButtonX";

export function ConfettiEmoji() {
  const handleClick = () => {
    const scalar = 3;
    const money = Confetti.shapeFromText({ text: "💵", scalar });
    const dolar = Confetti.shapeFromText({ text: "💲", scalar });

    const defaults = {
      spread: 360,
      ticks: 60,
      gravity: 0,
      decay: 0.96,
      startVelocity: 20,
      shapes: [money, dolar],
      scalar,
    };

    const shoot = () => {
      Confetti({
        ...defaults,
        particleCount: 30,
      });

      Confetti({
        ...defaults,
        particleCount: 5,
        flat: true,
      });

      Confetti({
        ...defaults,
        particleCount: 15,
        scalar: scalar / 2,
        shapes: ["circle"],
      });
    };

    setTimeout(shoot, 0);
    setTimeout(shoot, 100);
    setTimeout(shoot, 200);
  };

  return (
    <div className="relative justify-center">
      <button onClick={handleClick}>Trigger Emoji</button>
    </div>
  );
}

export function PaymentApproveButton({
  text,
  style,
  onClick,
}: {
  text: string;
  style: CSSProperties;
  onClick: () => void;
}) {
  const handleClick = () => {
    onClick();
    const scalar = 3;
    const money = Confetti.shapeFromText({ text: "💵", scalar });
    const dolar = Confetti.shapeFromText({ text: "💲", scalar });

    const defaults = {
      spread: 360,
      ticks: 60,
      gravity: 0,
      decay: 0.96,
      startVelocity: 10,
      shapes: [money, dolar],
      scalar,
    };

    const shoot = () => {
      Confetti({
        ...defaults,
        particleCount: 5,
      });

      Confetti({
        ...defaults,
        particleCount: 5,
        flat: true,
      });

      // Confetti({
      //   ...defaults,
      //   particleCount: 100,
      //   scalar: scalar / 2,
      //   shapes: ["circle"],
      // });
    };

    setTimeout(shoot, 0);
    setTimeout(shoot, 100);
    setTimeout(shoot, 200);
  };

  return (
    <div className="relative justify-center">
      <ButtonX
        text={text}
        Icon={{ isButton: true, IconName: undefined }}
        style={style}
        type="success"
        onClick={handleClick}
      />
    </div>
  );
}
