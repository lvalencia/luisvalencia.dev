<script setup lang="ts">
import { useI18n } from "vue-i18n";

const { t } = useI18n({
  useScope: "local",
});
</script>

<template>
  <div class="retro">
    <h1>{{ t("title") }}</h1>
    <h2>{{ t("context") }}</h2>
    <p>
      The following is a retrospective on the development cycle of <router-link to="/games/cube-up">Cube
        Up!</router-link>. I'm putting this here so that anyone can read what I set out to do, how it went, and how I feel
      about it.
      Given that I was inspired by the ABA <a target="_blank"
        href="https://abagames.github.io/joys-of-small-game-development-en/fun_to_make_small_games.html">"Making Small
        Games, Which Is Fun in Itself"</a>, I originally intended
      the development cycle to take at most 10 hours.
    </p>
    <p>
      The intention of developing this game was to:
    </p>
    <ul>
      <li>Find my spark for building software again</li>
      <li>Build something silly</li>
      <li>Attempt to make it entertaining for my friends</li>
      <li>Learn something about game development along the way</li>
    </ul>
    <p>
      Now that it's done, I'm going to take a breather and retro on how it went.
    </p>
    <h2>{{ t("the_good") }}</h2>
    <p>
      First and foremost, the reason I built this game was because I was trying to find a project to re-animate my
      excitement for building software. I've been in the industry now (as of the writing of this post) for about 10
      years.
      I've spent 6 and a half of them at Amazon; big corporations like that have a way of grinding you down.
      <em>This is speaking from personal experience, as an individual, not as a representative of the company, the
        thoughts and comments in this here post are mine and mine only and in no way representative of Amazon's view.
      </em>
      In short, I wanted to make sure that Amazon didn't extinguish my spark. <strong>In this sense I was successful; I
        feel rejuvenated.</strong>
    </p>
    <p>
      I would describe the experience as extremely positive. I felt good about developing the game. I felt good sharing it
      with people. I felt good soliciting feedback. I got to experiment a lot.
      I made myself laugh along the way (I really enjoyed recording the sounds).
    </p>
    <p>
      Initially, I shared the game with about 40 people. It's all people that know me; acquaintances and friends. The
      reception was overwhelmingly positive. I <em>think</em> I made everyone laugh; and that was the point.
      In that sense I would say I was successful in my endeavor. I got the impression that what people liked most about
      the game was the sound effects, and I would have to agree; when I recorded them I basically recorded them
      with the sole purpose of making myself laugh once I put them in the game.
    </p>
    <p>
      Additionally, as sort of a last-minute thing, I added a "Buy Me a Coffee" link on the game page. Coffee is
      expensive, I made it 5 bucks. I think it was my friend <a href="https://www.linkedin.com/in/joshuacorb/"
        target="_blank">Joshua Corb</a>
      that once told me that in tech sales, 3% is an excellent conversion rate. Out of 40 people, 2 people bought me a
      coffee, that's 5% conversion rate. Look at me! I rolling in the dough! Jokes aside, I think the two most EQ people I
      know were the
      ones that bought me the coffee; they know who they are, it was a really awesome gesture, thank you.
    </p>
    <p>
      The last thing I would say about this, is that from a technical perspective I saw instant pay-off for someone of my
      usual choices. Anytime I invested in what I felt were low-effort high ROI patterns, it immediately increased my
      velocity.
      Also, the website infrastructure I had already built made it really easy to "publish" the game and play around with
      the product and get feedback. Finally, I really like that the code is in GitHub, that it's written,
      in well-known and understood open-source technologies; meaning, anyone can look and figure out how everything is
      working.
    </p>
    <h2>{{ t("the_bad") }}</h2>
    <p>
      It wasn't all sunshine and butterflies though. The game took longer than I expected. I had allocated about 10 hours
      max and a timespan of about a couple weeks. It ended up taking 40 hours spread across 6 weeks. That being said, and
      not to downplay how much that sucks (that's an error margin of about 400%), I did feel that I had extremely good
      focus based on the time constraint I had set for myself. I didn't sweat the small stuff. I didn't fall trap to any
      bike-shedding. And, most importantly, I didn't fall into a trap of continued iteration for polish on the game with
      diminishing returns. I <em>think</em> I did at most 2 cycles of polish. I think if there had been a 3rd cycle the ROI
      wouldn't've been there.
    </p>
    <p>
      The other thing that I began to notice nearing the end of the cycle in developing the game was that the state
      management for the game was becoming unwieldy. I was also not interested in burning any more time in a detour for
      introducing state-management patterns that certainly would've helped (being that I was close to the end of
      development); I made an explicit decision to not invest time here. The result is the Vue Component that made up
      the game ballooned in size, it became really easy to introduce state-based bugs, and I had to restructure the main
      component organizationally, to logically group similar behaviors together. I <em>did</em> succeed in retaining my
      velocity as a result of this decision, I didn't felt like it slowed me down too much, however If I <em>had</em> had
      those structures in the first place it certainly would've been even faster.
    </p>
    <h2>{{ t("the_ugly") }}</h2>
    <p>
      While I did gain experience in building a web-based game, I'm not sure how much of this is translatable for game
      development in general. During development, I made sure to keep an eye and focus on the mind-set of "what makes a
      game tick?" instead of a particular technology or gimmick. However, a lot of development is made in game engines
      like Unity,Unreal, Godot, etc., have a more scene-based development flow, or in the very least a development flow
      that is tightly integrated with the engine and an opinionated way of building a game. The way I did my development
      was essentially a web-dev based flow. I used VueJS for state management, and then I wrote all the graphics and
      interaction in ThreeJS and audio playback in HowlerJS.
    </p>
    <p>
      I also ran into web-dev specific problems. Asset loading was messy. Unlike say Rails, VueJS doesn't really appear to
      have a mature assets-pipeline. This led to a lot of replicated code because of how I had to declare dynamic imports
      for assets. It involved an <code>import.meta.url</code> and stated tersely if I de-coupled the call-site and the
      import location, asset loading would fail. Admittedly, I didn't attempt to understand this problem too hard. I made
      a quick 2-way door decision; time-box a solution, if I couldn't find anything obvious just replicate code and figure
      it out later.
    </p>
    <p>
      Another web-specific problem was the full screen functionality is awkward. The API is really only applicable to
      non-mobile devices. Which meant I had to roll my own CSS for a mobile-definition of "full screen." And even on
      desktop the "full screen" was limited by the styling and aspect ratio of the component, so there's a lot of
      empty space.
    </p>
    <h2>{{ t("take_aways") }}</h2>
    <p>So what am I going to do about this? What am I going to do differently for the next game?</p>
    <h3>Build the next game in a Game Engine.</h3>
    <p>
      I think the biggest delta between what I did and typical game development is the setup.
      My setup was very restrictive in that it was web-specific. It's more awkward and clunky to try and take what
      I did and publish it to say a mobile app. Maybe I can use React-Native, maybe I can use a web-view,
      either way it doesn't seem like it be a on-click solution.
      But a lot of these game engines <em>do</em> have Web as an end target.
    </p>
    <h3>Keep a well-defined Cadence</h3>
    <p>
      While I <em>did</em> go over the time I had allocated for this project. I really enjoyed the 6-week development
      cycle. I plan to keep that. 6 weeks on, 2 weeks off and re-visit and tweak as needed.
    </p>
    <h3>Invest in State Management Patterns Up-Front</h3>
    <p>
      The only reason this wasn't a <strong>real</strong> problem, is because I intentionally kept the scope of the
      game small. Had this not been the case, this would've been the bottle-neck in my development speed. I'd rather
      come up with these patterns ahead of time (instead of having to make a decision on the fly and then refactoring
      my code during development) and assess their efficacy after-the fact; I suspect these will be well-established,
      well understood patterns, e.g. event-driven design, etc.
    </p>
    <h3>Keep a tight iteration cycle</h3>
    <p>
      Lastly, I want to keep a tight cycle where I can publish, play around-with, and solicit feedback as easily
      as I was able to, building this game. I cannot understate how value that was.
    </p>
  </div>
</template>

<style lang="scss">
strong {
  color: hsl(208deg, 37%, 0%)
}
</style>

<i18n lang="json">
{
  "en": {
    "title": "Cube-Up! Retro",
    "context": "Context",
    "the_good": "The Good",
    "the_bad": "The Bad",
    "the_ugly": "The Ugly",
    "take_aways": "Takeaways"
  },
  "es": {
    "title": "Cubos Arriba! Retrospectiva",
    "context": "Contexto",
    "the_good": "Lo Bueno",
    "the_bad": "Lo Malo",
    "the_ugly": "Lo Feo",
    "take_aways": "Lecciones Aprendidas"
  },
  "ca": {
    "title": "Cubs Amunt! Retrospectiu",
    "context": "Context",
    "the_good": "El Bo",
    "the_bad": "El Dolent",
    "the_ugly": "El Lletj",
    "take_aways": "Ensenyaments Clau"
  }
}
</i18n>