# sv

#### TODOs

18hr punch list

- [x] remaining “main menus” and action notifications
- [x] (16 Apr) "took way longer than expected" - refactoring current two step flow of create school => send school admin invite link to be:
      Create school => send admin invite link that includes a link that can be shared with teachers manually. The link needs to distinguish between teachers (we discussed me exploring adding email to that initial demographics question as the preferred DC option) + " retain resumable. "
- [ ] stripe payments page setup
- [ ] stripe webhook handling. details: - [ ] CREATE PRODUCTS - [ ] create session endpoint - [ ] handle webhook events (e.g. `checkout.session.completed`, bc it's a stripe-hosted checkout page)
      <!-- https://872700b78225.ngrok-free.app/api/stripe/payment-success --> - [ ] update user subscription status

Other

- [ ] refactor all publicIds for districts
- [ ] refactor all publicIds for districts => schools
- [ ] refactor all publicIds for nested routes & such
- [ ] refactor/complete assessment stuff
- [ ] fix all scores not showing up in results on school page (grid view)
- [ ] fix all scores not showing up in results on school page (list view)
- [ ] fix all inviteNewUserSchema
- [ ] fix all decodeAdminUserInviteToken

- [ ] find & fix all createAdminUserInviteToken to be adminInviteId based & decodeAdminUserInviteToken
- [ ] fix all email templates to use adminInviteId param
- [ ] move isUsed admin user to be post-registration action
- [ ] video embed (assume will be inputting the embedded snippet)
- [ ] Sessions Mechanism (assessment session)
- [ ] delete cascade handling
- [ ] route cleanup of old assessment methods
- [ ] fix http://localhost:5173/districts/4/schools/15/results/member-data route (button is commented out)
- [ ] fix http://localhost:5173/districts/4 route list view button (button is commented out)
- [ ] fix updateSchoolAdminWithToken func in queries route

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
