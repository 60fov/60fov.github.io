# Levels of Abstraction

## Precursor
After watching some programming talks and one off videos, a few mentioned this idea of *not* mixing levels of abstraction in code, for readability/maintainability, and I agree, mostly. Some time passes I start writing OpenGL code, and the first thing I want to do is some abstraction. So I dive right in, making structs, writing functions, tracking state, so on and so forth. It quickly becomes an unwieldly mess. No preparation, no thought, no planning, you know, the <span class="peek">usual<span class="peek-text">OpenGL does not like the usual</span></span>. So after scrapping that first attempt, I decide to make a set of conventions and principles to help with organization and test a different style of programming. I talk more about said conventions and principles, [here](/record/entries/brevity.html).

<br/>

## Back to Levels of Abstraction

So here I am, post conventions, staring at my code, and I notice I'm using a few OpenGL, OpenGL-wrapped, and shader object calls in the main loop (mostly due to laziness) and I think to myself "*sigh* these are definitely different levels of abstraction and they are certainly mixed". Then a side thought occurs, "What *are* my levels of abstraction?"

So here we are, me and my <span class="peek">levels of abstraction<span class="peek-text">roooooll credits</span></span>.

<br/>

### Level 0: Raw OpenGL
  - this isn't actually abstraction, hence the zero
  - e.g. `glGenBuffers(...)`, `glEnable(GlEnum)`, etc.
  - this should be completely abstracted away

<br/>

### Level 1: OpenGL Wrapper
  - layer for type safety and consistent naming conventions
  - layer is also completely optional, Nim is just a good language for it
  - e.g. `gl_buffer_id_create(...)`, `gl_capability_enable(GLCapability)`, etc.
  - if you need to call OpenGL directly this is the go-to
  - writing this is mostly looking at and understanding OpenGL documentation

<br/>

### Level 2: OpenGL *Objects*
  - groups frequent/related calls together in logical objects
    
    e.g.
    ```nim
    gl_buffer_id_create(...)
    gl_buffer_id_bind(...)
    gl_buffer_data(...)
    gl_buffer_unbind(...)
    ```
    becomes
    ```nim
    buffer_create(...)
    ```
    and
    ```nim
    gl_vertex_binding_bind(...)
    gl_vertex_binding_bind(...)
    gl_vertex_binding_divisor(...)
    gl_vertex_attrib_binding(...)
    gl_vertex_attrib_binding(...)
    gl_vertex_attrib_binding(...)
    gl_vertex_attrib_format(...)
    gl_vertex_attrib_format(...)
    gl_vertex_attrib_format(...)
    gl_vertex_attrib_enable(...)
    gl_vertex_attrib_enable(...)
    gl_vertex_attrib_enable(...)
    ```
    becomes
    ```nim
    binding1 = vertex_binding_create(...)
    binding2 = vertex_binding_create(...)
    attrib1 = vertex_attrib_create(...)
    attrib2 = vertex_attrib_create(...)
    attrib3 = vertex_attrib_create(...)
    layout = vertex_layout_create(
      [binding1, binding2], 
      [attrib1, attrib2, attrib3]
    )
    verex_array_layout_apply(vao, layout) # this one call
    ```
  - can also track OpenGL state minimizing slow upstream data transfer
  - were most programming time and thought will be spent, it is the least concrete and requires a good understanding of OpenGL and what's happening to the overall state
  - this could be split into two levels (convenience and state tracking), but it seems like unnecessary complexity

<br/>

### Level 3: Conceptual Graphics Objects
  - allows the developer to quickly create easily manageable graphics concepts and connect them to data
  - e.g. meshes, models, materials, etc.
  - this level is a bit weird, it doesn't have to contain just graphics concepts i.e. cameras, VFX, UI, etc., but in this case it probably will