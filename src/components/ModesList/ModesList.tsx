import "./ModesList.css";
import {ModeCard} from "../ModeCard/ModeCard";
import { type Mode } from "../../modules/modeApi";

interface ModesListProps {
  modes: Mode[]; // ✅ Явный тип
}

export const ModesList = ({ modes }: ModesListProps) => (
  <div className="modes-grid__container">
    {modes.map((mode) => (
      <ModeCard key={mode.id} mode={mode} />
    ))}
  </div>
);