describe("throttle(f, 1000)", function() {
  var f1000;
  var log = "";
  function f(a) { log += a; } 

  before(function() {
    f1000 = throttle(f, 1000);
    this.clock = sinon.useFakeTimers();
  });

  it("первый вызов срабатывает тут же", function() {
    f1000(1); // такой вызов должен сработать тут же
    assert.equal(log, "1");
  });

  it("тормозит второе срабатывание до 1000мс", function() {
    f1000(2); // (тормозим, не прошло 1000мс)
    f1000(3); // (тормозим, не прошло 1000мс)
    // через 1000 мс запланирован вызов с последним аргументом 

    assert.equal(log, "1"); // пока что сработал только первый вызов
 
    this.clock.tick(1000); // прошло 1000мс времени
    assert.equal(log, "13");  // log==13, т.к. сработал вызов f1000(3)
  });

  it("тормозит третье срабатывание до 1000мс после второго", function() {
    this.clock.tick(100);
    f1000(4); // (тормозим, с последнего вызова прошло 100мс - менее 1000мс)
    this.clock.tick(100);
    f1000(5); // (тормозим, с последнего вызова прошло 200мс - менее 1000мс)
    this.clock.tick(700);
    f1000(6); // (тормозим, с последнего вызова прошло 900мс - менее 1000мс)
 
    this.clock.tick(100); // сработал вызов с 6

    assert.equal(log, "136");
  });

  after(function() {
    this.clock.restore();
  });

});