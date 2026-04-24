# Compatibility shim for running the GitHub Pages Jekyll stack on Ruby 3.4+.
# Liquid 4 still calls Ruby's removed taint APIs during local rendering.
class Object
  def tainted?
    false
  end unless method_defined?(:tainted?)

  def untaint
    self
  end unless method_defined?(:untaint)
end
