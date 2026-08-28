import BottomTrustStrip from "@/components/science/BottomTrustStrip";
import CtaBanner from "@/components/science/CtaBanner";
import FormulationProcess from "@/components/science/FormulationProcess";
import IngredientsGrid from "@/components/science/IngredientsGrid";
import QualitySafety from "@/components/science/QualitySafety";
import ScienceBehind from "@/components/science/ScienceBehind";
import ScienceHero from "@/components/science/ScienceHero";
import TransparencyBanner from "@/components/science/TransparencyBanner";

export default function ScienceIngredientsPage() {
  return (
    <>
      <ScienceHero />
      <IngredientsGrid />
      <ScienceBehind />
      <FormulationProcess />
      <QualitySafety />
      <TransparencyBanner />
      <CtaBanner />
      <BottomTrustStrip />
    </>
  );
}