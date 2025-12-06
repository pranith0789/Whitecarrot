// app/company/[companyId]/components/TemplateRenderer.ts

import IntroVideoRenderer from "./IntroVideo";
import AboutLeftRenderer from "./AboutLeft";
import CultureCardsRenderer from "./CultureCards";
import EmployeeVoiceRenderer from "./EmployeeVoice";
import ContactSectionRenderer from "./Contact";
import CareersSectionRenderer from "./Career";
import FAQRenderer from "./FAQRenderer";
import StatsRenderer from "./StatsRenderer";
import AwardsRenderer from "./AwardsRenderer";
import WhyJoinRenderer from "./WhyJoinRenderer";
import DEIRenderer from "./DEIRenderer";

// Map DB section_id → renderer component
export const TEMPLATE_RENDERERS: Record<string, any> = {
  intro_video: IntroVideoRenderer,
  about_left: AboutLeftRenderer,
  culture_cards: CultureCardsRenderer,
  employee_voice: EmployeeVoiceRenderer,
  contact_default: ContactSectionRenderer,
  careers_default: CareersSectionRenderer,
  faq_section: FAQRenderer,
  stats_numbers: StatsRenderer,
  awards_section: AwardsRenderer,
  why_join_us: WhyJoinRenderer,
  dei_section: DEIRenderer,
};

// Fallback for unknown templates
export function FallbackRenderer({ content }: any) {
  return (
    <section className="p-20 text-center bg-red-50 text-red-600">
      <h2 className="text-xl font-bold">Unknown template type</h2>
      <pre className="mt-4 text-sm">{JSON.stringify(content, null, 2)}</pre>
    </section>
  );
}
