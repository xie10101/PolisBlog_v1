export default function PostEditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      {/* Post Editor specific layout elements like a sidebar or secondary nav can go here */
      }
      {children}
    </section>
  );
}
