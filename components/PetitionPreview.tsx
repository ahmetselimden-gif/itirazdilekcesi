import PetitionDocument from "@/components/PetitionDocument";

type PetitionPreviewProps = {
  petition: string;
};

export default function PetitionPreview({ petition }: PetitionPreviewProps) {
  return (
    <div className="mt-5 rounded-[22px] border border-line bg-white p-4 sm:p-6">
      <PetitionDocument petition={petition} />
    </div>
  );
}
