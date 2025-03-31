Cannot make progress on the front end for now until the back end is ready. So some notes.

---

The `campaigns` of a location are on the `location` object. We go through the 4 campaign types as we show the 4 campaign buttons, and if there are campaigns of a type, we show the campaign button with the `reward` coin icon. The campaign button is a link to the campaign modal.

If there are one or more surveys, we show the survey button with the `reward` coin icon. Here's what happens when the user clicks on that button.

---

First, get the list of surveys available for the location:

```ts
queryFn: () =>
api.get<AvailableSurveys>(`campaign/location/${location_uuid}/my-surveys`).json(),
```

This returns an array of surveys, to show in the modal. Iterate over the array.

If `responded` is true, don't show the `reward` coin icon, and the whole row is grayed out and clicking it does nothing.

If `responded` is false, show the `reward` coin icon, and the whole row is clickable.

When a survey is clicked, we get the survey's questions:

```ts
queryFn: () =>
api.get<SurveyQuestions>(`campaign/${survey.uuid}/survey-questions`).json(),
```

This returns an array of questions, to show in the modal one at a time.

Show the survey's first question (prompt and alternatives).

When the first question is answered, show the next question.

When the last question is answered, POST the response to the survey endpoint:

```ts
export const Survey = async ({ campaign_uuid, reward, respond }) => {
  const response = await request.post(`/campaign/${campaign_uuid}/survey-response/`, respond);
  return !response.error ? { data: { reward } } : { error: response.error };
};
```

Then, show a success message. The reward value we had already; it's not returned by the POST. The reward will show up in the user's wallet soon, but for now, we can use the initial reward value from the list of AvailableSurveys.

The success message says 'Thank you for completing this survey!" And "You earned X [coin icon]. Refresh your wallet later" <-- we need a better message here, obviously.

**I think we want to invalidateQueries at this point? Or before this point?**

We probably want to add an "OK" button to close the modal. If user wants to do another survey, they can click the "Survey" campaign button to show the list again.
