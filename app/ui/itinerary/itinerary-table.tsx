import { getAllActivities } from '@/app/lib/db/activities';
import { Activity } from '@/app/lib/types';

export default async function ItineraryTable() {
  const activities = await getAllActivities()

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {activities?.map((activity: any) => (
              <ItineraryItem
                activity={activity}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ItineraryItem(props: any) {
  var activity: Activity = props.activity
  return (
    <div>
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <div className="mb-2 flex items-center">
            <p>{activity.description}</p>
          </div>
        </div>
      </div>
      <div className="flex w-full items-center justify-between pt-4">
        <div>
          <p>{activity.activity_date}</p>
        </div>
      </div>
    </div>
  );
}
