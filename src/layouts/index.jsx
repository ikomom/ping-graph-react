export default function Layout({
  children,
  location,
  route,
  history,
  match,
}) {
  return (
    <div>
      <div>{children}</div>
    </div>
  );
}
