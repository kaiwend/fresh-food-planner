type InfoBlockItem = {
  title: string;
  value: string;
};

const InfoBlocks = (props: { items: InfoBlockItem[] }) => (
  <div className="p-6 pt-0 grid gap-4">
    {props.items.map((item) => (
      <SingleInfoBlock title={item.title} value={item.value} />
    ))}
  </div>
);

export default InfoBlocks;

const SingleInfoBlock = (props: { title: string; value: string }) => (
  <div className="flex flex-col space-y-1">
    <div className="text-sm text-muted-foreground">{props.title}</div>
    <div className="text-sm font-medium leading-none">{props.value}</div>
  </div>
);
