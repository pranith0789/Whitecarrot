import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import{createClient} from '@/app/lib/auth'
import { supabaseServer } from "@/app/lib/supabase";
import Navbar from "@/app/components/Navbar";
import InfiniteScrollLoader from "@/app/components/InfiniteScrollLoader";

export default async function CompanyPage(props: any) {
  // const cookieStore = cookies();
  // const supabaseAuth = createClient(cookieStore);

  // const {
  //   data: { user },
  // } = await supabaseAuth.auth.getUser();

  // if (!user) redirect("/auth/login");
  // if(!user) redirect("/auth/login")
  const params = await props.params;
  const companyId = params.companyId;

  const supabase = supabaseServer();

  const { data: sections, error } = await supabase
    .from("company_sections")
    .select("*")
    .eq("company_id", companyId)
    .order("position");

  if (error) return <div>Error loading company sections</div>;
  if (!sections || sections.length === 0) return <div>No sections found</div>;

  const sorted = [...sections].sort(
    (a, b) => (a.position ?? 0) - (b.position ?? 0)
  );

  // 👇 REMOVE careers_default so it does NOT render in company page
  const filtered = sorted.filter(
    (sec) => sec.section_id !== "careers_default"
  );

  const normalizeId = (id: string) => id.toLowerCase().replace(/\s+/g, "-");

  const navSections = filtered.map((sec) => ({
    id: normalizeId(sec.section_id),
    label: sec.title || sec.section_id.toUpperCase(),
    position: sec.position,
    section_id: sec.section_id,
  }));

  const infiniteSections = filtered.map((sec) => ({
    id: normalizeId(sec.section_id),
    template: sec.section_id,
    content: sec.content,
  }));

  return (
    <div className="w-full">
      <Navbar sections={navSections} companyId={companyId} />

      <div className="pt-20">
        <InfiniteScrollLoader sections={infiniteSections} />
      </div>
    </div>
  );
}
