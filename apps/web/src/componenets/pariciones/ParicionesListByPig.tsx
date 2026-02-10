import ParicionCard from "./ParicionCard";
import type { Paricion } from "../../types/pigTypes";
import Container from "../../ui/Container";

type ParicionesListProps = {
  pariciones: Paricion[];
  pigId: string;
  onDeleteParicion: (paricionId: string) => void;
};

const ParicionesListByPig = ({
  pariciones,
  pigId,
  onDeleteParicion,
}: ParicionesListProps) => {
  return (
    <Container className="flex flex-wrap items-stretch gap-4">
      {pariciones.map((paricion) => (
        <ParicionCard
          key={paricion._id}
          {...paricion}
          pigId={pigId}
          onDelete={onDeleteParicion}
        />
      ))}
    </Container>
  );
};

export default ParicionesListByPig;
