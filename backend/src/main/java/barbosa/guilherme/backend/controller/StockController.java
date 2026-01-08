package barbosa.guilherme.backend.controller;

import barbosa.guilherme.backend.Service.StockService;
import barbosa.guilherme.backend.model.Stock;
import barbosa.guilherme.backend.requests.StockPostRequestBody;
import barbosa.guilherme.backend.requests.StockPutRequestBody;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/stocks")
public class StockController {
    private final StockService service;

    public StockController(StockService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Stock>> listAll(){
        return new ResponseEntity<>(service.findAll(), HttpStatus.OK);
    }

    @PostMapping("/add")
    public ResponseEntity<Stock> add(@RequestBody @Valid StockPostRequestBody stockPostRequestBody){
        return new ResponseEntity<>(service.save(stockPostRequestBody), HttpStatus.CREATED);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable long id){
        service.deleteById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PutMapping
    public ResponseEntity<Void> update(@RequestBody @Valid StockPutRequestBody stockPutRequestBody){
        service.update(stockPutRequestBody);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
