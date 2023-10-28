const operators = [
  { name: "is" },
  { name: "is not" },
  { name: "contains" },
  { name: "does not contain" },
  { name: "exists" },
  { name: "does not exist" },
  { name: "=" },
  { name: "!=" },
  { name: ">=" },
  { name: "<=" },
];

type RuleFormProps = {
  s_key: string;
};

function RuleForm({ s_key }: RuleFormProps) {
  return <p>Rule form</p>;
}

export default RuleForm;
