import IntroVideo from "./TemplateRenderer/IntroVideo";
import AboutLeft from "./TemplateRenderer/AboutLeft";
import CultureCards from "./TemplateRenderer\/CultureCards";
import EmployeeVoice from "./TemplateRenderer/EmployeeVoice";
import ContactSection from "./TemplateRenderer/Contact";
import CareersSection from "./TemplateRenderer/Career";

export default function SectionRenderer({ section, companyId }: any) {
  const map: any = {
    intro_video: IntroVideo,
    about_left: AboutLeft,
    culture_cards: CultureCards,
    employee_voice: EmployeeVoice,
    contact_default: ContactSection,
    careers_default: (props: any) => (
      <CareersSection {...props} companyId={companyId} />
    ),
  };

  const Comp = map[section.template_id || section.type];
  if (!Comp) return null;

  return <Comp content={section.content} />;
}
