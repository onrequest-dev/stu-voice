import Link from "next/link";
import STUvoiceOpinionManager from "../STUvoiceOpinionManager";
import SupportedPlatforms from "../SupportedPlatforms";
const SupportedSitesContent = () => {
    return (
    <div className="container mx-auto p-4">
      <Link href='/stu-voice-private/creat-DailyOpinion'>رابط ابو الورقتين</Link>
      <SupportedPlatforms/>
    </div>
  );
};
export default SupportedSitesContent;