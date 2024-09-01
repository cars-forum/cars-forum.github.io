import { html } from "@lit/lit-html.js";
import { dataService } from '../service/dataService.js';

const template = (info) => html`
<section id="create-topic">
    <h1>You are not allowed to post!</h1>
    <p>You have been banned. Your ban expires at ${new Date(info.expiresOn.iso).toLocaleString('uk-Uk')}.</p>
    <p>Reason: ${info.reason}</p>
</section>
`

export async function showBanMessageView(ctx) {
    const userId = ctx.userUtils.getUserData()?.objectId;
    const banInfo = await dataService.getBanInfo(userId);
    ctx.render(template(banInfo));
}