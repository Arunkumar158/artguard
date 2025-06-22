import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const DashboardPage = () => {
  return (
    <div className="p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Welcome to your dashboard. This page is protected.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage; 