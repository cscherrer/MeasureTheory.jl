var documenterSearchIndex = {"docs":
[{"location":"intro/","page":"Introduction","title":"Introduction","text":"There are lots of packages for working with probability distributions. But very often, we need to work with \"distributions\" that really aren't. ","category":"page"},{"location":"intro/","page":"Introduction","title":"Introduction","text":"For example, the correspondence between regularization and Bayesian prior distributions leads naturally to the idea of extending probabilistic programming systems to cover both. But it's easy to come up with a loss function for which the integral of the corresponding \"prior\" is infinite! The result is not really a distirbution. It is, however, still a measure.","category":"page"},{"location":"intro/","page":"Introduction","title":"Introduction","text":"Even restricted to Bayesian methods, users might sometimes want to use an improper prior. By definition, these cannot be integrated over their domain. But an improper prior is still a measure.","category":"page"},{"location":"intro/","page":"Introduction","title":"Introduction","text":"In Markov chain Monte Carlo (MCMC), we often work with distributions for which we can only caluculate  the log-density up to an additive constant. Considering this instead as a measure can be helpful. Even better, consdering intermediate computations along the way as computations on measures saves us from computing normalization terms where the end result will discard this anyway.","category":"page"},{"location":"intro/","page":"Introduction","title":"Introduction","text":"To be clear, that's not to say that we always discard normalizations. Rather, they're considered as belonging to the measure itself, rather than being included in each sub-computation. If measures you work with happen to also be probability distributions, you'll always be able to recover those results.","category":"page"},{"location":"adding/#Adding-a-New-Measure","page":"Adding a New Measure","title":"Adding a New Measure","text":"","category":"section"},{"location":"adding/#Parameterized-Measures","page":"Adding a New Measure","title":"Parameterized Measures","text":"","category":"section"},{"location":"adding/","page":"Adding a New Measure","title":"Adding a New Measure","text":"This is by far the most common kind of measure, and is especially useful as a way to describe families of probability distributions.","category":"page"},{"location":"adding/#Declaring-a-Parameterized-Measure","page":"Adding a New Measure","title":"Declaring a Parameterized Measure","text":"","category":"section"},{"location":"adding/","page":"Adding a New Measure","title":"Adding a New Measure","text":"To start, declare a @measure. For example, Normal is declared as","category":"page"},{"location":"adding/","page":"Adding a New Measure","title":"Adding a New Measure","text":"@measure Normal(μ,σ) ≪ (1/sqrt2π) * Lebesgue(ℝ)","category":"page"},{"location":"adding/","page":"Adding a New Measure","title":"Adding a New Measure","text":"[ℝ is typed as \\bbR <TAB>]","category":"page"},{"location":"adding/","page":"Adding a New Measure","title":"Adding a New Measure","text":"A ParameterizedMeasure can have multiple parameterizations, which as dispatched according to the names of the parameters. The (μ,σ) here specifies names to assign if none are given. So for example,","category":"page"},{"location":"adding/","page":"Adding a New Measure","title":"Adding a New Measure","text":"julia> Normal(-3.0, 2.1)\nNormal(μ = -3.0, σ = 2.1)","category":"page"},{"location":"adding/","page":"Adding a New Measure","title":"Adding a New Measure","text":"The right side, (1/sqrt2π) * Lebesgue(ℝ), gives the base measure. Lebesgue in this case is the technical name for the measure associating an interval of real numbers to its length. The (1/sqrt2π) comes from the normalization constant in the probability density function,","category":"page"},{"location":"adding/","page":"Adding a New Measure","title":"Adding a New Measure","text":"f_textNormal(xμσ) = frac1σ sqrt2 pi e^-frac12left(fracx-musigmaright)^2  ","category":"page"},{"location":"adding/","page":"Adding a New Measure","title":"Adding a New Measure","text":"Making this part of the base measure allows us to avoid including it in every computation.","category":"page"},{"location":"adding/","page":"Adding a New Measure","title":"Adding a New Measure","text":"The ≪ (typed as \\ll <TAB>) can be read \"is dominated by\". This just means that any set for which the base measure is zero must also have zero measure in what we're defining.","category":"page"},{"location":"adding/#Defining-a-Log-Density","page":"Adding a New Measure","title":"Defining a Log Density","text":"","category":"section"},{"location":"adding/","page":"Adding a New Measure","title":"Adding a New Measure","text":"Most computations involve log-densities rather than densities themselves, so these are our first priority. density(d,x) will default to exp(logdensity(d,x)), but you can add a separate method if it's more efficient.","category":"page"},{"location":"adding/","page":"Adding a New Measure","title":"Adding a New Measure","text":"The definition is simple:","category":"page"},{"location":"adding/","page":"Adding a New Measure","title":"Adding a New Measure","text":"logdensity(d::Normal{()} , x) = - x^2 / 2 ","category":"page"},{"location":"adding/","page":"Adding a New Measure","title":"Adding a New Measure","text":"There are a few things here worth noting.","category":"page"},{"location":"adding/","page":"Adding a New Measure","title":"Adding a New Measure","text":"First, we dispatch by the names of d (here there are none), and the type of x is not specified.","category":"page"},{"location":"adding/","page":"Adding a New Measure","title":"Adding a New Measure","text":"Also, there's nothing here about μ and σ. These location-scale parameters behave exactly the same across lots of distributions, so we have a macro to add them:","category":"page"},{"location":"adding/","page":"Adding a New Measure","title":"Adding a New Measure","text":"@μσ_methods Normal()","category":"page"},{"location":"adding/","page":"Adding a New Measure","title":"Adding a New Measure","text":"Let's look at another example, the Beta distribution. Here the base measure is Lebesgue(𝕀) (support is the unit interval). The log-density is","category":"page"},{"location":"adding/","page":"Adding a New Measure","title":"Adding a New Measure","text":"function logdensity(d::Beta{(:α, :β)}, x)\n    return (d.α - 1) * log(x) + (d.β - 1) * log(1 - x) - logbeta(d.α, d.β)\nend","category":"page"},{"location":"adding/","page":"Adding a New Measure","title":"Adding a New Measure","text":"Note that when possible, we avoid extra control flow for checking that x is in the support. In applications, log-densities are often evaluated only on the support by design. Such checks should be implemented at a higher level whenever there is any doubt.","category":"page"},{"location":"adding/","page":"Adding a New Measure","title":"Adding a New Measure","text":"Finally, note that in both of these examples, the log-density has a relatively direct algebraic form. It's imnportant to have this whenever possible to allow for symbolic manipulation (using libraries like SymolicUtils.jl) and efficient automatic differentiation.","category":"page"},{"location":"adding/#Random-Sampling","page":"Adding a New Measure","title":"Random Sampling","text":"","category":"section"},{"location":"adding/","page":"Adding a New Measure","title":"Adding a New Measure","text":"For univariate distributions, you should define a Base.rand method that uses three arguments:","category":"page"},{"location":"adding/","page":"Adding a New Measure","title":"Adding a New Measure","text":"A Random.AbstractRNG to use for randomization,\nA type to be returned, and\nThe measure to sample from.","category":"page"},{"location":"adding/","page":"Adding a New Measure","title":"Adding a New Measure","text":"For our Normal example, this is","category":"page"},{"location":"adding/","page":"Adding a New Measure","title":"Adding a New Measure","text":"Base.rand(rng::Random.AbstractRNG, T::Type, d::Normal{()}) = randn(rng, T)","category":"page"},{"location":"adding/","page":"Adding a New Measure","title":"Adding a New Measure","text":"Again, for location-scale families, other methods are derived automatically. ","category":"page"},{"location":"adding/","page":"Adding a New Measure","title":"Adding a New Measure","text":"For multivariate distributions (or anything that requires heap allocation), you should instead define a Random.rand! method. This also takes three arguments, different from rand:","category":"page"},{"location":"adding/","page":"Adding a New Measure","title":"Adding a New Measure","text":"The Random.AbstractRNG,\nThe measure to sample from, and\nWhere to store the result.","category":"page"},{"location":"adding/","page":"Adding a New Measure","title":"Adding a New Measure","text":"For example, here's the implementation for ProductMeasure:","category":"page"},{"location":"adding/","page":"Adding a New Measure","title":"Adding a New Measure","text":"@propagate_inbounds function Random.rand!(rng::AbstractRNG, d::ProductMeasure, x::AbstractArray)\n    @boundscheck size(d.data) == size(x) || throw(BoundsError)\n\n    @inbounds for j in eachindex(x)\n        x[j] = rand(rng, eltype(x), d.data[j])\n    end\n    x\nend","category":"page"},{"location":"adding/","page":"Adding a New Measure","title":"Adding a New Measure","text":"Note that in this example, d.data[j] might itself require allocation. This implementation is likely to change in the future to make it easier to define nested structures without any need for ongoing allocation.","category":"page"},{"location":"adding/#Primitive-Measures","page":"Adding a New Measure","title":"Primitive Measures","text":"","category":"section"},{"location":"adding/","page":"Adding a New Measure","title":"Adding a New Measure","text":"Most measures are defined in terms of a logdensity with respect to some other measure, its basemeasure. But how is that measure defined? It can't be \"densities all the way down\"; at some point, the chain has to stop.","category":"page"},{"location":"adding/","page":"Adding a New Measure","title":"Adding a New Measure","text":"A primitive measure is just a measure that has itself as its own base measure. Note that this also means its log-density is always zero.","category":"page"},{"location":"adding/","page":"Adding a New Measure","title":"Adding a New Measure","text":"Here's the implementation of Lebesgue:","category":"page"},{"location":"adding/","page":"Adding a New Measure","title":"Adding a New Measure","text":"struct Lebesgue{X} <: AbstractMeasure end\n\nLebesgue(X) = Lebesgue{X}()\n\nbasemeasure(μ::Lebesgue) = μ\n\nisprimitive(::Lebesgue) = true\n\nsampletype(::Lebesgue{ℝ}) = Float64\nsampletype(::Lebesgue{ℝ₊}) = Float64\nsampletype(::Lebesgue{𝕀}) = Float64\n\nlogdensity(::Lebesgue, x) = zero(float(x))","category":"page"},{"location":"adding/","page":"Adding a New Measure","title":"Adding a New Measure","text":"We haven't yet talked about sampletype. When you call rand without specifying a type, there needs to be a default. That default is the sampletype. This only needs to be defined for primitive measures, because others will fall back on ","category":"page"},{"location":"adding/","page":"Adding a New Measure","title":"Adding a New Measure","text":"sampletype(μ::AbstractMeasure) = sampletype(basemeasure(μ))","category":"page"},{"location":"","page":"Home","title":"Home","text":"CurrentModule = MeasureTheory","category":"page"},{"location":"#MeasureTheory","page":"Home","title":"MeasureTheory","text":"","category":"section"},{"location":"#API","page":"Home","title":"API","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"","category":"page"},{"location":"","page":"Home","title":"Home","text":"Modules = [MeasureTheory]","category":"page"},{"location":"#MeasureTheory.Density","page":"Home","title":"MeasureTheory.Density","text":"struct Density{M,B}\n    μ::M\n    base::B\nend\n\nFor measures μ and ν with μ≪ν, the density of μ with respect to ν (also called the Radon-Nikodym derivative dμ/dν) is a function f defined on the support of ν with the property that for any measurable a ⊂ supp(ν), μ(a) = ∫ₐ f dν.\n\nBecause this function is often difficult to express in closed form, there are many different ways of computing it. We therefore provide a formal representation to allow comptuational flexibilty.\n\n\n\n\n\n","category":"type"},{"location":"#MeasureTheory.DensityMeasure","page":"Home","title":"MeasureTheory.DensityMeasure","text":"struct DensityMeasure{F,B} <: AbstractMeasure\n    density :: F\n    base    :: B\nend\n\nA DensityMeasure is a measure defined by a density with respect to some other \"base\" measure \n\n\n\n\n\n","category":"type"},{"location":"#MeasureTheory.Kernel","page":"Home","title":"MeasureTheory.Kernel","text":"kernel(f, M)\nkernel((f1, f2, ...), M)\n\nA kernel κ = kernel(f, m) returns a wrapper around a function f giving the parameters for a measure of type M, such that κ(x) = M(f(x)...) respective κ(x) = M(f1(x), f2(x), ...)\n\nIf the argument is a named tuple (;a=f1, b=f1), κ(x) is defined as M(;a=f(x),b=g(x)).\n\nReference\n\nhttps://en.wikipedia.org/wiki/Markov_kernel\n\n\n\n\n\n","category":"type"},{"location":"#MeasureTheory.LKJL","page":"Home","title":"MeasureTheory.LKJL","text":"The LKJ distribution (Lewandowski et al 2009) for the Cholesky factor L of correlation matrices.\n\nA correlation matrix Ω=LL has the density Ω^η-1. However, it is usually not necessary to construct Ω, so this distribution is formulated for the Cholesky decomposition L*L', and takes L directly.\n\nNote that the methods does not check if L yields a valid correlation matrix. Valid values are η  0. When η  1, the distribution is unimodal at Ω=I, while 0  η  1 has a trough. η = 2 is recommended as a vague prior. When η = 1, the density is uniform in Ω, but not in L, because of the Jacobian correction of the transformation.\n\nAdapted from https://github.com/tpapp/AltDistributions.jl\n\n\n\n\n\n","category":"type"},{"location":"#MeasureTheory.SuperpositionMeasure","page":"Home","title":"MeasureTheory.SuperpositionMeasure","text":"struct SuperpositionMeasure{X,NT} <: AbstractMeasure\n    components :: NT\nend\n\nSuperposition of measures is analogous to mixture distributions, but (because measures need not be normalized) requires no scaling.\n\nThe superposition of two measures μ and ν can be more concisely written as μ + ν.\n\n\n\n\n\n","category":"type"},{"location":"#MeasureTheory.WeightedMeasure","page":"Home","title":"MeasureTheory.WeightedMeasure","text":"struct WeightedMeasure{R,M} <: AbstractMeasure\n    logweight :: R\n    base :: M\nend\n\n\n\n\n\n","category":"type"},{"location":"#MeasureTheory.:≃-Tuple{Any,Any}","page":"Home","title":"MeasureTheory.:≃","text":"≃(μ,ν)\n\nEquivalence of Measure\n\nMeasures μ and ν on the same space X are equivalent, written μ ≃ ν, if μ ≪ ν and ν ≪ μ.\n\nNote that this is often written ~ in the literature, but this is overloaded in probabilistic programming, so we use alternate notation.\n\n\n\n\n\n","category":"method"},{"location":"#MeasureTheory.:≪","page":"Home","title":"MeasureTheory.:≪","text":"≪(μ,ν)\n\nAbsolute continuity\n\nThe following are equivalent:\n\nμ ≪ ν\nμ is absolutely continuous wrt ν\nThere exists a function f such that μ = ∫f dν\n\n\n\n\n\n","category":"function"},{"location":"#MeasureTheory.asparams","page":"Home","title":"MeasureTheory.asparams","text":"asparams build on TransformVariables.as to construct bijections to the parameter space of a given parameterized measure. Because this is only possible for continuous parameter spaces, we allow constraints to assign values to any subset of the parameters.\n\n\n\nasparams(::Type{<:ParameterizedMeasure}, ::Val{::Symbol})\n\nReturn a transformation for a particular parameter of a given parameterized measure. For example,\n\njulia> asparams(Normal, Val(:σ))\nasℝ₊\n\n\n\nasparams(::Type{<: ParameterizedMeasure{N}}, constraints::NamedTuple) where {N}\n\nReturn a transformation for a given parameterized measure subject to the named tuple constraints. For example,\n\njulia> asparams(Binomial{(:p,)}, (n=10,))\nTransformVariables.TransformTuple{NamedTuple{(:p,), Tuple{TransformVariables.ScaledShiftedLogistic{Float64}}}}((p = as𝕀,), 1)\n\n\n\naspararams(::ParameterizedMeasure)\n\nReturn a transformation with no constraints. For example,\n\njulia> asparams(Normal{(:μ,:σ)})\nTransformVariables.TransformTuple{NamedTuple{(:μ, :σ), Tuple{TransformVariables.Identity, TransformVariables.ShiftedExp{true, Float64}}}}((μ = asℝ, σ = asℝ₊), 2)\n\n\n\n\n\n","category":"function"},{"location":"#MeasureTheory.basemeasure","page":"Home","title":"MeasureTheory.basemeasure","text":"basemeasure(μ)\n\nMany measures are defined in terms of a logdensity relative to some base measure. This makes it important to be able to find that base measure.\n\nFor measures not defined in this way, we'll typically have basemeasure(μ) == μ.\n\n\n\n\n\n","category":"function"},{"location":"#MeasureTheory.isprimitive-Tuple{Any}","page":"Home","title":"MeasureTheory.isprimitive","text":"isprimitive(μ)\n\nMost measures are defined in terms of other measures, for example using a density or a pushforward. Those that are not are considered (in this library, it's not a general measure theory thing) to be primitive. The canonical example of a primitive measure is Lebesgue(X) for some X.\n\nThe default method is     isprimitive(μ) = false\n\nSo when adding a new primitive measure, it's necessary to add a method for its type that returns true.\n\n\n\n\n\n","category":"method"},{"location":"#MeasureTheory.logdensity","page":"Home","title":"MeasureTheory.logdensity","text":"logdensity(μ::AbstractMeasure{X}, x::X)\n\nCompute the logdensity of the measure μ at the point x. This is the standard way to define logdensity for a new measure. the base measure is implicit here, and is understood to be basemeasure(μ).\n\nMethods for computing density relative to other measures will be\n\n\n\n\n\n","category":"function"},{"location":"#MeasureTheory.∫-Tuple{Any,AbstractMeasure}","page":"Home","title":"MeasureTheory.∫","text":"∫(f, base::AbstractMeasure; log=true)\n\nDefine a new measure in terms of a density f over some measure base. If log=true (the default), f is considered as a log-density.\n\n\n\n\n\n","category":"method"},{"location":"#MeasureTheory.𝒹-Tuple{AbstractMeasure,AbstractMeasure}","page":"Home","title":"MeasureTheory.𝒹","text":"𝒹(μ::AbstractMeasure, base::AbstractMeasure; log=true)\n\nCompute the Radom-Nikodym derivative (or its log, if log=true) of μ with respect to base.\n\n\n\n\n\n","category":"method"},{"location":"#MeasureTheory.@domain-Tuple{Any,Any}","page":"Home","title":"MeasureTheory.@domain","text":"@domain(name, T)\n\nDefines a new singleton struct T, and a value name for building values of that type.\n\nFor example, MeasureTheory.@domain ℝ RealNumbers is equivalent to\n\nstruct RealNumbers <: MeasureTheory.AbstractDomain end\n\nexport ℝ\n\nℝ = MeasureTheory.RealNumbers()\n\nBase.show(io::IO, ::RealNumbers) = print(io, \"ℝ\")\n\n\n\n\n\n","category":"macro"},{"location":"#MeasureTheory.@measure-Tuple{Any}","page":"Home","title":"MeasureTheory.@measure","text":"@measure <declaration>\n\nThe <declaration> gives a measure and its default parameters, and specifies its relation to its base measure. For example,\n\n@measure Normal(μ,σ) ≃ Lebesgue{X}\n\ndeclares the Normal is a measure with default parameters μ and σ, and it is equivalent to its base measure, which is Lebesgue{X}\n\nYou can see the generated code like this:\n\njulia> MacroTools.prettify(@macroexpand @measure Normal(μ,σ) ≃ Lebesgue{X})\nquote\n    struct Normal{P, X} <: AbstractMeasure\n        par::P\n    end\n    function Normal(nt::NamedTuple)\n        P = typeof(nt)\n        return Normal{P, eltype(Normal{P})}\n    end\n    Normal(; kwargs...) = Normal((; kwargs...))\n    (basemeasure(μ::Normal{P, X}) where {P, X}) = Lebesgue{X}\n    Normal(μ, σ) = Normal(; Any[:μ, :σ])\n    ((:≪)(::Normal{P, X}, ::Lebesgue{X}) where {P, X}) = true\n    ((:≪)(::Lebesgue{X}, ::Normal{P, X}) where {P, X}) = true\nend\n\nNote that the eltype function needs to be defined separately by the user.\n\n\n\n\n\n","category":"macro"}]
}