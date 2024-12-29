import { Meta, StoryFn } from "@storybook/react";
import BodyHtml, { BodyHtmlProps } from "../components/BodyHtml";
import "../../src/index.css";

const meta: Meta = {
  title: "Components/BodyHtml",
  component: BodyHtml,
};

export default meta;

const Template: StoryFn<BodyHtmlProps> = (args) => <BodyHtml {...args} />;

export const Default = Template.bind({});
Default.args = {
  body_html:
    '&lt;div class="md"&gt;&lt;p&gt;Shopee is 6.5-7.5k, tiktok is &amp;gt;7k (can go up to 8-9k if you’re a returning intern), OKX is 7k, PayPal is 6.5k, visa is around 6.3-6.6k, the more prominent US banks (BOA, JPM, MS, Citi) are high 6k to low 7k (except Goldman which is around 6.3k). Gov agencies like DSTA, DSO, CSIT are around 6k (but heard it can go up to 7). GIC is 7k. OGP can offer up to 9k but idk if they’re still hiring. CPFB grad program is around 7k (?) St Eng and NCS is around 4-5.5k (?), DBS SEED program is around 5.5k (?).&lt;/p&gt;\n\n&lt;p&gt;I think out of all these, only shopee, tiktok and OKX is hiring more aggressively? The bulge bracket banks mostly convert their summer analyst interns for full time.&lt;/p&gt;\n\n&lt;p&gt;Note that the numbers here are base pay, I didn’t include bonuses and RSUs.&lt;/p&gt;\n&lt;/div&gt;',
};
