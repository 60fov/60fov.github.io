# Brevity

While learning OpenGL I have realized I don't write very maintainable code. Because of that I often rewrite code, so I decided I would try and see how others write more maintainable code. I'm not a big fan of reading source code so to YouTube I go. After watching some videos of Uncle Bob and his take on clean code, I decide I didn't like a few of the ideas, I can't remember which ones, and it was also a bit a abstract for my current needs. Then I come across [Eskil Steenberg](https://twitter.com/EskilSteenberg), and [how he programs in C](https://youtu.be/443UNeGrFoM), and it's exactly what I was looking for. He gives pretty specific naming conventions, but more importantly he explains why he writes the way he does. His whole style is very different from mine and that's exactly what I needed, a good ol' switch up. His style is to encourage writing <span class="peek">readable, reusable, maintainable<span class="peek-text"> The Holy Trinity ✝ </span></span> code. Here are the main principles I <span class="peek">used<span class="peek-text">stole</span></span> from the video and their results.

<br/>

### Principles:

- Descriptive over concise naming 
  - e.g. `set_mousemotion_proc()` -> `pai_event_mousemotion_proc_set()`
  - being descriptive is very helpful long term
  - writing longer lines is a small price to pay for readability
  - this one was easy to follow fairly concrete
- Keep logically sequential code sequential
  - minimize levels of indirection
  - this rule is pretty vague
- Keep it simple, stupid
  - aka, <span class="peek">DOTS<span class="peek-text"> Don't Over Think Shit </span></span>, s/o Kenny Beats
- Start APIs from the outside
  - i.e. design the frontend then make the backend
  - you write the backend <span class="peek">once<span class="peek-text"> *hopefully* </span></span> and reuse the interface
- No <span class="peek">OO<span class="peek-text">Object Orientation</span></span>!
  - I refuse to write object oriented <span class="peek">code<span class="peek-text">personal projects</span></span> anyway so this one was easy
  - OO doesn't mesh with game dev well
  - <span class="peek">Some people<span class="peek-text"> Brian Will, Johnathan Blow </span></span> have said that OO doesn't solve the problem and I have to agree

<br/>

### Results:
After using these conventions and following this principles, the resulting measured goals:

  - Readability
    - definitely increased the organization is just beautiful tbh
  - Reusability
    - I did use the overall structure of the code I write first however this should be measure more long term
  - Maintainability
    - this ties directly into the organization of the structure which was awesome


<br/>

These principles were coupled with specific syntax rules, But of course, there were a few issues which boil down to, "I tried to be too specific about the conventions", mostly syntactically. They were derived from C which doesn't mesh too well will the structure Nim. Especially imports vs includes, enums, bitfields, and Nim's existing naming conventions that are built into VSCode's syntax highlighting. These are all generally superficial, but they did make writing the code unpleasant at times. I definitely will change specific syntax conventions I made, but overall I think it was successful. I definitely learned a lot about code structure and my personal preferences, and writing potentially publicly used code.

<br/>