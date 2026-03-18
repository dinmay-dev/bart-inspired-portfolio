const SettingsPage = () => (
  <div className="space-y-8">
    <h1 className="text-3xl font-bold text-foreground">Settings</h1>
    <div className="border border-border p-6 bg-card">
      <h3 className="font-semibold text-foreground mb-2">About</h3>
      <p className="text-sm text-muted-foreground">
        This admin panel lets you manage all visible content on your portfolio. Changes are saved to your database and reflected instantly on the live site.
      </p>
    </div>
  </div>
);

export default SettingsPage;
