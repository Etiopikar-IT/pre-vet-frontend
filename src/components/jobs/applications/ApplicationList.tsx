import ApplicationCard, {
  type ApplicationListItem,
} from "./ApplicationsCard";

interface ApplicationsListProps {
  applications: ApplicationListItem[];
}

export default function ApplicationsList({
  applications,
}: ApplicationsListProps) {
  return (
    <ul className="space-y-4">
      {applications.map((application) => (
        <li key={application.id}>
          <ApplicationCard application={application} />
        </li>
      ))}
    </ul>
  );
}