import { NewActivityForm } from "@/app/ui/itinerary/new-activity-form"; 

 export default function createNewActivity() {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <NewActivityForm/>
      </div>
    </div>
  );
}