from js import Response

def hello(name):
    return "Hello, " + name + "!"

def on_fetch(request):
    return Response.new(hello("World"))
